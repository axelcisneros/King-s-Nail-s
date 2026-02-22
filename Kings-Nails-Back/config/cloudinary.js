// Cargar variables de entorno ANTES de configurar Cloudinary
require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configurar Cloudinary con las credenciales del .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Usaremos multer con memoryStorage y subiremos el buffer a Cloudinary desde los controllers
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Aceptar solo imágenes jpeg/png/jpg
    if (/image\/(jpeg|png|jpg)/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Formato de imagen no permitido'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB por archivo
});

module.exports = { cloudinary, upload };