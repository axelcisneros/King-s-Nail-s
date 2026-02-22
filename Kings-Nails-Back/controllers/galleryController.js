const asyncHandler = require('express-async-handler');
const Gallery = require('../models/GalleryImageModel');
const { cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');

// @desc    Obtener todas las imágenes de la galería
// @route   GET /api/gallery
// @access  Public
const getGalleryImages = asyncHandler(async (req, res) => {
  const images = await Gallery.find({}).sort({ createdAt: -1 });
  res.json(images);
});

// @desc    Crear una nueva imagen en la galería
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryImage = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer) {
    res.status(400);
    throw new Error('Por favor, sube un archivo de imagen.');
  }

  const { title, description } = req.body;

  // Subir a Cloudinary desde el buffer usando upload_stream
  const uploadFromBuffer = (buffer) =>
    new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'NailsGallery',
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

  const image = new Gallery({
    title,
    description,
    imageUrl: result.secure_url,
    public_id: result.public_id,
  });

  const createdImage = await image.save();
  res.status(201).json(createdImage);
});

// @desc    Actualizar una imagen de la galería
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGalleryImage = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const image = await Gallery.findById(req.params.id);

  if (image) {
    image.title = title || image.title;
    image.description = description ?? image.description; // Allow empty string

    // Si se sube una nueva imagen, actualízala en Cloudinary
    if (req.file && req.file.buffer) {
      // 1. Borra la imagen antigua de Cloudinary
      await cloudinary.uploader.destroy(image.public_id);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'NailsGallery',
            resource_type: 'image',
          },
          (error, uploadResult) => {
            if (error) return reject(error);
            resolve(uploadResult);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      // 2. Asigna la nueva URL y public_id
      image.imageUrl = result.secure_url;
      image.public_id = result.public_id;
    }

    const updatedImage = await image.save();
    res.json(updatedImage);
  } else {
    res.status(404);
    throw new Error('Imagen no encontrada');
  }
});

// @desc    Eliminar una imagen de la galería
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await Gallery.findById(req.params.id);

  if (!image) {
    res.status(404);
    throw new Error('Imagen no encontrada');
  }

  // Eliminar de la base de datos (el middleware se encarga de Cloudinary automáticamente)
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ message: 'Imagen eliminada exitosamente' });
});

module.exports = { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage };