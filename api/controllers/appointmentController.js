const asyncHandler = require('express-async-handler');
const Appointment = require('../models/AppointmentModel');
const Quote = require('../models/QuoteModel');
const sendEmail = require('../utils/sendEmail');

// @desc    Crear una nueva cita
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  // Aceptamos tanto `requestedDate` (nuevo) como `date` (compatibilidad)
  const { clientPhone, date, requestedDate, quoteId } = req.body;

  if (!quoteId) {
    res.status(400);
    throw new Error('Es necesario seleccionar una cotización para agendar la cita.');
  }

  const quote = await Quote.findById(quoteId).populate({ path: 'designs', select: '_id imageUrl description' });

  if (!quote || quote.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Cotización no encontrada.');
  }

  if (!['quoted', 'accepted'].includes(quote.status)) {
    res.status(400);
    throw new Error('La cotización aún no ha sido respondida o ya fue utilizada.');
  }

  const finalDateRaw = requestedDate || date || req.body.requestedDate || req.body.date;
  const finalDate = finalDateRaw ? new Date(finalDateRaw) : undefined;
  const designDocs = Array.isArray(quote.designs) ? quote.designs : [];
  const validDesignIds = designDocs.map((design) => design._id);

  const appointment = new Appointment({
    user: req.user?._id || undefined,
    clientName: req.user?.name || req.body.clientName || '', // Tomamos preferentemente el nombre del usuario logueado
    clientEmail: req.user?.email || req.body.clientEmail || '', // Preferimos email del usuario logueado, si no, aceptamos el que venga en body
    clientPhone,
    service: quote.service,
    // Solo usamos requestedDate como campo principal
    requestedDate: finalDate,
    notes: quote.notes,
    designs: validDesignIds,
    quote: quote._id,
  });

  const createdAppointment = await appointment.save();
  await createdAppointment.populate('designs', 'imageUrl description');
  await createdAppointment.populate('quote', 'service notes adminPrice adminComment status respondedAt acceptedAt _id');

  // Marcar la cotización como aceptada
  quote.status = 'accepted';
  quote.acceptedAt = new Date();
  await quote.save();

  // Notificar al admin de la nueva cita
  try {
    const formattedDate = new Date(createdAppointment.requestedDate).toLocaleString('es-ES', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const emailHtml = `
      <h1>Nueva Solicitud de Cita</h1>
      <p>Has recibido una nueva solicitud de cita a través de la página web.</p>
      <h2>Detalles de la Cita:</h2>
      <ul>
        <li><strong>Cliente:</strong> ${createdAppointment.clientName}</li>
        <li><strong>Teléfono:</strong> ${createdAppointment.clientPhone}</li>
        <li><strong>Servicio:</strong> ${createdAppointment.service}</li>
        <li><strong>Fecha y Hora:</strong> ${formattedDate}</li>
        <li><strong>Notas:</strong> ${createdAppointment.notes || 'Ninguna'}</li>
  ${quote.adminPrice !== undefined ? `<li><strong>Monto cotizado:</strong> $${Number(quote.adminPrice).toFixed(2)}</li>` : ''}
  ${quote.adminComment ? `<li><strong>Comentario del administrador:</strong> ${quote.adminComment}</li>` : ''}
        ${designDocs.length
          ? `<li><strong>Diseños adjuntos:</strong><ul>${designDocs
              .map(
                (design, index) =>
                  `<li><a href="${design.imageUrl}" target="_blank" rel="noopener noreferrer">Diseño ${index + 1}</a>${design.description ? ` - ${design.description}` : ''}</li>`
              )
              .join('')}</ul></li>`
          : ''}
      </ul>
      <p>Por favor, contacta al cliente para confirmar la cita o gestiónala desde tu panel de administración.</p>
    `;

        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `Nueva Cita Solicitada - ${createdAppointment.clientName}`,
          html: emailHtml,
        });
  } catch (error) {
    console.error('Error al enviar el correo de notificación al admin:', error);
  }

  res.status(201).json(createdAppointment);
});

// @desc    Obtener todas las citas
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate('user', 'id name email')
    .populate({ path: 'designs', select: 'imageUrl description' })
    .populate({
      path: 'quote',
      select: 'service notes adminPrice adminComment status user respondedAt acceptedAt _id',
    });
  res.json(appointments);
});

// @desc    Obtener las citas del usuario logueado
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = asyncHandler(async (req, res) => {
  // Incluimos la referencia a `review` para que el frontend pueda saber si la cita ya tiene una reseña
  const appointmentsRaw = await Appointment.find({ user: req.user._id })
    .populate({ path: 'review', select: 'rating comment isApproved createdAt' })
    .populate({ path: 'designs', select: 'imageUrl description' })
    .populate({ path: 'quote', select: 'service notes adminPrice adminComment status _id' });

  // Mapear para añadir un campo explícito hasReview (boolean) y evitar ambigüedades en el frontend
  const appointments = appointmentsRaw.map((a) => ({
    ...a.toObject(),
    hasReview: Boolean(a.review),
  }));

  res.json(appointments);
});

// @desc    Actualizar una cita (ej. confirmar, cancelar)
// @route   PUT /api/appointments/:id
// @access  Private/Admin
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (appointment) {
    const oldStatus = appointment.status;
    const newStatus = req.body.status;

    appointment.status = newStatus || appointment.status;
    appointment.notes = req.body.notes ?? appointment.notes;
    appointment.requestedDate = req.body.date || appointment.requestedDate;

    // Si el admin está cancelando la cita, registrar quién la canceló
    if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
      appointment.cancelledBy = 'admin';
      appointment.cancelledAt = new Date();
    }

    const updatedAppointment = await appointment.save();

    // Si el estado cambia a 'confirmed', notificar al cliente.
    if (newStatus === 'confirmed' && oldStatus !== 'confirmed') {
      try {
        const formattedDate = new Date(updatedAppointment.requestedDate).toLocaleString(
          'es-ES',
          {
            dateStyle: 'full',
            timeStyle: 'short',
          }
        );

        const emailHtml = `
          <h1>¡Tu cita ha sido confirmada!</h1>
          <p>Hola ${appointment.user.name},</p>
          <p>Nos complace informarte que tu cita en Kings Nails ha sido confirmada con los siguientes detalles:</p>
          <ul>
            <li><strong>Servicio:</strong> ${updatedAppointment.service}</li>
            <li><strong>Fecha y Hora:</strong> ${formattedDate}</li>
          </ul>
          <p>¡Te esperamos con mucho gusto!</p>
        `;

        await sendEmail({
          to: appointment.user.email,
          subject: 'Confirmación de Cita - Kings Nails',
          html: emailHtml,
        });
      } catch (error) {
        console.error('Error al enviar el correo de confirmación al cliente:', error);
      }
    }

    // Si el estado cambia a 'cancelled', notificar al cliente.
    if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
      try {
        const formattedDate = new Date(updatedAppointment.requestedDate).toLocaleString(
          'es-ES',
          {
            dateStyle: 'full',
            timeStyle: 'short',
          }
        );

        const emailHtml = `
          <h1>Tu cita ha sido cancelada</h1>
          <p>Hola ${appointment.user.name},</p>
          <p>Lamentamos informarte que tu cita en Kings Nails programada para el <strong>${formattedDate}</strong> ha sido cancelada.</p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos. Puedes agendar una nueva cita a través de nuestra página web.</p>
          <p>Atentamente,<br>El equipo de Kings Nails</p>
        `;

        await sendEmail({
          to: appointment.user.email,
          subject: 'Cancelación de Cita - Kings Nails',
          html: emailHtml,
        });
      } catch (error) {
        console.error('Error al enviar el correo de cancelación al cliente:', error);
      }
    }

    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Cita no encontrada');
  }
});

// @desc    Eliminar una cita
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    await appointment.deleteOne();
    res.json({ message: 'Cita eliminada' });
  } else {
    res.status(404);
    throw new Error('Cita no encontrada');
  }
});

// @desc    Cliente cancela su propia cita
// @route   PUT /api/appointments/my/:id/cancel
// @access  Private
const cancelMyAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Cita no encontrada');
  }

  // Verificar que la cita pertenece al usuario que la cancela
  if (appointment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('No autorizado para cancelar esta cita');
  }

  // Evitar cancelar citas que ya están en un estado final
  if (['completed', 'cancelled'].includes(appointment.status)) {
    res.status(400);
    throw new Error(`No se puede cancelar una cita que ya está ${appointment.status}.`);
  }

  appointment.status = 'cancelled';
  appointment.cancelledBy = 'client';
  appointment.cancelledAt = new Date();
  const updatedAppointment = await appointment.save();

  // Notificar al admin de la cancelación por parte del cliente
  try {
    const formattedDate = new Date(updatedAppointment.requestedDate).toLocaleString('es-ES', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const emailHtml = `
      <h1>Cancelación de Cita por Cliente</h1>
      <p>La clienta <strong>${updatedAppointment.clientName}</strong> ha cancelado su cita.</p>
      <h2>Detalles de la Cita Cancelada:</h2>
      <ul>
        <li><strong>Cliente:</strong> ${updatedAppointment.clientName}</li>
        <li><strong>Servicio:</strong> ${updatedAppointment.service}</li>
        <li><strong>Fecha y Hora Original:</strong> ${formattedDate}</li>
      </ul>
      <p>Esta cita ha sido marcada como cancelada en el sistema. No se requiere acción de tu parte.</p>
    `;

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Cita Cancelada por Cliente - ${updatedAppointment.clientName}`,
      html: emailHtml,
    });
  } catch (error) {
    console.error('Error al enviar el correo de cancelación al admin:', error);
  }

  res.json({ message: 'Cita cancelada correctamente', appointment: updatedAppointment });
});

// @desc    Reagendar una cita (cliente o admin)
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (cliente solo sus citas, admin cualquier cita)
const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { newDate } = req.body;

  if (!newDate) {
    res.status(400);
    throw new Error('Debe proporcionar una nueva fecha para reagendar la cita.');
  }

  const appointment = await Appointment.findById(req.params.id).populate('user', 'name email');

  if (!appointment) {
    res.status(404);
    throw new Error('Cita no encontrada');
  }

  // Verificar permisos: el cliente solo puede reagendar sus propias citas
  const isAdmin = req.user.role === 'admin' || req.user.role === 'superAdmin';
  const isOwner = appointment.user._id.toString() === req.user._id.toString();
  
  if (!isAdmin && !isOwner) {
    res.status(401);
    throw new Error('No autorizado para reagendar esta cita');
  }

  // Validar que la cita no esté en estado final
  if (appointment.status === 'completed') {
    res.status(400);
    throw new Error('No se puede reagendar una cita que ya está completada.');
  }

  // Si la cita está cancelada, solo permitir reagendación si fue cancelada por admin
  if (appointment.status === 'cancelled') {
    if (appointment.cancelledBy !== 'admin') {
      res.status(400);
      throw new Error('Solo se pueden reagendar citas canceladas por el administrador.');
    }
    
    // Solo el cliente puede reagendar su propia cita cancelada por admin
    if (!isOwner) {
      res.status(401);
      throw new Error('Solo el cliente puede reagendar su cita cancelada por el administrador.');
    }
  }

  const originalDate = new Date(appointment.requestedDate);
  const requestedDate = new Date(newDate);
  const currentDate = new Date();

  // Calcular días restantes hasta la cita original
  const timeDiff = originalDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // Si la cita no está cancelada por admin, aplicar validaciones escalonadas
  if (!(appointment.status === 'cancelled' && appointment.cancelledBy === 'admin')) {
    // Validación principal: No se puede reagendar si faltan menos de 3 días
    if (daysRemaining < 3) {
      res.status(400);
      throw new Error('No se puede reagendar con menos de 3 días de anticipación.');
    }

    // Aplicar validaciones escalonadas según días restantes
    if (daysRemaining >= 3 && daysRemaining <= 10) {
      // 3-10 días: Solo hacia futuras fechas
      if (requestedDate <= originalDate) {
        res.status(400);
        throw new Error('Con 3-10 días restantes, solo se puede reagendar hacia fechas futuras.');
      }
    } else if (daysRemaining >= 11 && daysRemaining <= 15) {
      // 11-15 días: Adelantar máximo 7 días o futuras fechas
      const sevenDaysBeforeOriginal = new Date(originalDate);
      sevenDaysBeforeOriginal.setDate(originalDate.getDate() - 7);
      
      if (requestedDate < sevenDaysBeforeOriginal) {
        res.status(400);
        throw new Error('Con 11-15 días restantes, solo se puede adelantar hasta 7 días antes de la fecha original.');
      }
    } else if (daysRemaining >= 16 && daysRemaining <= 30) {
      // 16-30 días: Adelantar máximo 15 días o futuras fechas
      const fifteenDaysBeforeOriginal = new Date(originalDate);
      fifteenDaysBeforeOriginal.setDate(originalDate.getDate() - 15);
      
      if (requestedDate < fifteenDaysBeforeOriginal) {
        res.status(400);
        throw new Error('Con 16-30 días restantes, solo se puede adelantar hasta 15 días antes de la fecha original.');
      }
    } else if (daysRemaining > 30) {
      // Más de 30 días: Adelantar máximo 1 mes o futuras fechas
      const oneMonthBeforeOriginal = new Date(originalDate);
      oneMonthBeforeOriginal.setMonth(originalDate.getMonth() - 1);
      
      if (requestedDate < oneMonthBeforeOriginal) {
        res.status(400);
        throw new Error('Con más de 30 días restantes, solo se puede adelantar hasta 1 mes antes de la fecha original.');
      }
    }
  }

  // Validación adicional: La nueva fecha no puede ser en el pasado
  if (requestedDate < currentDate) {
    res.status(400);
    throw new Error('No se puede reagendar hacia una fecha pasada.');
  }

  const oldDate = appointment.requestedDate;
  const oldStatus = appointment.status;
  
  appointment.requestedDate = requestedDate;
  
  // Manejar cambios de estado según el tipo de reagendación
  if (appointment.status === 'cancelled' && appointment.cancelledBy === 'admin') {
    // Si la cita estaba cancelada por admin, cambiar a pendiente al reagendar
    appointment.status = 'pending';
    appointment.cancelledBy = null;
    appointment.cancelledAt = null;
  } else if (appointment.status === 'confirmed' && !isAdmin) {
    // Si la cita estaba confirmada y es reagendada por el cliente, cambiar a pendiente
    appointment.status = 'pending';
  }
  // Si es el admin quien reagenda una cita confirmada, mantiene el estado confirmado
  
  const updatedAppointment = await appointment.save();

  // Formatear fechas para los emails
  const oldFormattedDate = new Date(oldDate).toLocaleString('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  const newFormattedDate = new Date(updatedAppointment.requestedDate).toLocaleString('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  // Enviar notificaciones
  try {
    if (isAdmin) {
      // Si es admin quien reagenda, notificar al cliente
      const emailHtml = `
        <h1>Tu cita ha sido reagendada</h1>
        <p>Hola ${appointment.user.name},</p>
        <p>Tu cita en Kings Nails ha sido reagendada:</p>
        <ul>
          <li><strong>Servicio:</strong> ${updatedAppointment.service}</li>
          <li><strong>Fecha anterior:</strong> ${oldFormattedDate}</li>
          <li><strong>Nueva fecha:</strong> ${newFormattedDate}</li>
        </ul>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <p>¡Te esperamos!</p>
      `;

      await sendEmail({
        to: appointment.user.email,
        subject: 'Cita Reagendada - Kings Nails',
        html: emailHtml,
      });
    } else {
      // Si es cliente quien reagenda, notificar al admin
      const wasReactivated = oldStatus === 'cancelled';
      const emailHtml = `
        <h1>${wasReactivated ? 'Cita Reactivada y Reagendada' : 'Cita Reagendada'} por Cliente</h1>
        <p>La clienta <strong>${appointment.user.name}</strong> ha ${wasReactivated ? 'reactivado y reagendado' : 'reagendado'} su cita${wasReactivated ? ' que había sido cancelada' : ''}.</p>
        <h2>Detalles del Cambio:</h2>
        <ul>
          <li><strong>Cliente:</strong> ${appointment.user.name}</li>
          <li><strong>Servicio:</strong> ${updatedAppointment.service}</li>
          <li><strong>Estado anterior:</strong> ${oldStatus === 'cancelled' ? 'Cancelada por admin' : 'Activa'}</li>
          <li><strong>Fecha anterior:</strong> ${oldFormattedDate}</li>
          <li><strong>Nueva fecha:</strong> ${newFormattedDate}</li>
          <li><strong>Estado actual:</strong> ${updatedAppointment.status === 'pending' ? 'Pendiente de confirmación' : updatedAppointment.status}</li>
        </ul>
        <p>${wasReactivated ? 'La cita ha sido reactivada y está pendiente de tu confirmación.' : 'La cita mantiene su estado actual y está lista para ser confirmada si es necesario.'}</p>
      `;

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Cita Reagendada - ${appointment.user.name}`,
        html: emailHtml,
      });
    }
  } catch (error) {
    console.error('Error al enviar el correo de reagendación:', error);
  }

  res.json({ 
    message: 'Cita reagendada correctamente', 
    appointment: updatedAppointment,
    oldDate: oldFormattedDate,
    newDate: newFormattedDate
  });
});

module.exports = { createAppointment, getAppointments, getMyAppointments, updateAppointment, deleteAppointment, cancelMyAppointment, rescheduleAppointment };