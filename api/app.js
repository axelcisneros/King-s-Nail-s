const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userDesignRoutes = require('./routes/userDesignRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const logRoutes = require('./routes/logRoutes');

// Cargar variables de entorno
dotenv.config();

// Configuración de Passport
require('./config/passport')(passport);

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(helmet());

// Configurar CORS para permitir cookies (withCredentials) desde el frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const TUNNEL_FRONTEND_URL = process.env.TUNNEL_FRONTEND_URL; // opcional
const EXTRA_ORIGINS = process.env.FRONTEND_EXTRA_ORIGINS ? process.env.FRONTEND_EXTRA_ORIGINS.split(',').map(o => o.trim()).filter(Boolean) : [];
const allowedOrigins = [FRONTEND_URL];
if (TUNNEL_FRONTEND_URL) allowedOrigins.push(TUNNEL_FRONTEND_URL);
allowedOrigins.push(...EXTRA_ORIGINS);
const corsOptions = {
  origin: (origin, callback) => {
    // permitir solicitudes sin origin (ej. herramientas como curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json()); // Para aceptar datos JSON en el body
app.use(cookieParser()); // Para poder leer las cookies

// Middlewares de Passport
app.use(passport.initialize());

// Rutas de la API
app.get('/', (req, res) => {
  res.send('API de Kings Nails está funcionando...');
});

app.use('/api/users', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/designs', userDesignRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/logs', logRoutes);

const os = require('os');
const PORT = process.env.PORT || 5000;

// Ruta de diagnóstico que devuelve información de red y entorno
app.get('/diag', (req, res) => {
  const nets = os.networkInterfaces();
  res.json({
    env: process.env.NODE_ENV || 'development',
    port: PORT,
    interfaces: nets,
  });
});

// Middlewares de errores (deben ir al final)
app.use(notFound);
app.use(errorHandler);

const HOST = process.env.HOST || '0.0.0.0';

// Solo iniciar el servidor si NO estamos en Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app.listen(PORT, HOST, () => {
    const addr = server.address();
    console.log(`Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT} (host ${HOST})`);
    console.log('Server address info:', addr);
  });
}

// Exportar la app para Vercel Serverless Functions
module.exports = app;