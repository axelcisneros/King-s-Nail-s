const asyncHandler = require('express-async-handler');
const UserDesign = require('../models/UserDesignModel');
const { cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');

// @desc    Subir un nuevo diseño de usuario
// @route   POST /api/designs
// @access  Private
const uploadDesign = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer) {
    res.status(400);
    throw new Error('Por favor, sube un archivo de imagen.');
  }

  // Subir a Cloudinary desde el buffer
  const uploadFromBuffer = (buffer) =>
    new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'UserDesigns',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

  const result = await uploadFromBuffer(req.file.buffer);

  const design = new UserDesign({
    user: req.user._id,
    imageUrl: result.secure_url,
    public_id: result.public_id,
    description: req.body.description, // Opcional
  });

  const createdDesign = await design.save();
  res.status(201).json(createdDesign);
});

// @desc    Obtener los diseños del usuario logueado
// @route   GET /api/designs
// @access  Private
const getMyDesigns = asyncHandler(async (req, res) => {
  const designs = await UserDesign.find({ user: req.user._id });
  res.json(designs);
});

// @desc    Eliminar un diseño del usuario logueado
// @route   DELETE /api/designs/:id
// @access  Private
const deleteMyDesign = asyncHandler(async (req, res) => {
  const design = await UserDesign.findById(req.params.id);

  if (!design) {
    res.status(404);
    throw new Error('Diseño no encontrado');
  }

  if (design.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('No autorizado');
  }

  // Eliminar de la base de datos (el middleware se encarga de Cloudinary automáticamente)
  await UserDesign.findByIdAndDelete(req.params.id);
  res.json({ message: 'Diseño eliminado exitosamente' });
});

// @desc    Obtener todos los diseños de todos los usuarios (para el admin)
// @route   GET /api/designs/all
// @access  Private/Admin
const getAllUserDesigns = asyncHandler(async (req, res) => {
  const designs = await UserDesign.find({}).populate('user', 'name email');
  res.json(designs);
});

// @desc    Eliminar diseño como admin
// @route   DELETE /api/designs/all/:id
// @access  Private/Admin
const deleteUserDesignByAdmin = asyncHandler(async (req, res) => {
  const design = await UserDesign.findById(req.params.id);
  
  if (!design) {
    res.status(404);
    throw new Error('Diseño no encontrado');
  }

  // Eliminar de la base de datos (el middleware se encarga de Cloudinary automáticamente)
  await UserDesign.findByIdAndDelete(req.params.id);
  res.json({ message: 'Diseño eliminado por admin exitosamente' });
});

module.exports = {
  uploadDesign,
  getMyDesigns,
  deleteMyDesign,
  getAllUserDesigns,
  deleteUserDesignByAdmin,
};