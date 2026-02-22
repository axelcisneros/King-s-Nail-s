const asyncHandler = require('express-async-handler');
const Quote = require('../models/QuoteModel');
const UserDesign = require('../models/UserDesignModel');
const { sendNewQuoteAdminNotification, sendQuoteResponseNotification } = require('../utils/emailNotifications');

// @desc    Solicitar una nueva cotización
// @route   POST /api/quotes
// @access  Private
const createQuote = asyncHandler(async (req, res) => {
  const { service, notes, designIds } = req.body;

  if (!service || typeof service !== 'string' || !service.trim()) {
    res.status(400);
    throw new Error('El servicio es obligatorio.');
  }

  const designsRaw = Array.isArray(designIds) ? designIds.filter(Boolean) : [];
  let designDocs = [];
  if (designsRaw.length) {
    const uniqueIds = [...new Set(designsRaw.map((id) => id.toString()))];
    const fetched = await UserDesign.find({
      _id: { $in: uniqueIds },
      user: req.user._id,
    }).select('_id');
    designDocs = fetched.map((design) => design._id);
  }

  const quote = await Quote.create({
    user: req.user._id,
    service: service.trim(),
    notes: notes || '',
    designs: designDocs,
    status: 'requested',
  });

  await quote.populate({ path: 'designs', select: 'imageUrl description' });
  await quote.populate({ path: 'user', select: 'name email' });

  // Enviar notificación al admin sobre nueva cotización
  try {
    await sendNewQuoteAdminNotification({
      user: quote.user,
      service: quote.service,
      notes: quote.notes,
      designs: quote.designs
    });
  } catch (emailError) {
    console.error('❌ Error enviando notificación de nueva cotización al admin:', emailError.message);
    // No fallar la creación de cotización por error de email
  }

  res.status(201).json(quote);
});

// @desc    Obtener mis cotizaciones
// @route   GET /api/quotes/my
// @access  Private
const getMyQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find({ user: req.user._id })
    .populate({ path: 'designs', select: 'imageUrl description' })
    .sort({ createdAt: -1 });

  res.json(quotes);
});

// @desc    Obtener todas las cotizaciones (admin)
// @route   GET /api/quotes
// @access  Private/Admin
const getAllQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find({})
    .populate({ path: 'user', select: 'name email phone' })
    .populate({ path: 'designs', select: 'imageUrl description' })
    .sort({ createdAt: -1 });

  res.json(quotes);
});

// @desc    Responder a una cotización (asignar precio/comentario/estado)
// @route   PUT /api/quotes/:id/respond
// @access  Private/Admin
const respondQuote = asyncHandler(async (req, res) => {
  const { adminPrice, adminComment, status } = req.body;
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    res.status(404);
    throw new Error('Cotización no encontrada.');
  }

  if (status && !['quoted', 'declined', 'cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Estado de cotización inválido.');
  }

  if (adminPrice !== undefined) {
    const numericPrice = Number(adminPrice);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      res.status(400);
      throw new Error('El precio debe ser un número positivo.');
    }
    quote.adminPrice = numericPrice;
  }

  if (adminComment !== undefined) {
    quote.adminComment = adminComment;
  }

  if (status) {
    quote.status = status;
  } else if (adminPrice !== undefined) {
    quote.status = 'quoted';
  }

  quote.respondedAt = new Date();

  const updated = await quote.save();
  await updated.populate({ path: 'designs', select: 'imageUrl description' });
  await updated.populate({ path: 'user', select: 'name email phone' });

  // Enviar notificación al cliente cuando la cotización fue respondida
  if (status === 'quoted' || status === 'declined') {
    try {
      await sendQuoteResponseNotification({
        user: updated.user,
        service: updated.service,
        adminPrice: updated.adminPrice,
        adminComment: updated.adminComment,
        status: updated.status,
        notes: updated.notes
      });
    } catch (emailError) {
      console.error('❌ Error enviando notificación de cotización respondida al cliente:', emailError.message);
      // No fallar la respuesta por error de email
    }
  }

  res.json(updated);
});

module.exports = {
  createQuote,
  getMyQuotes,
  getAllQuotes,
  respondQuote,
};
