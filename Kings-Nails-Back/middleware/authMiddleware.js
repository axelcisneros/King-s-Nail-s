const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Leer el token JWT desde la cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('No autorizado, token inválido');
    }
  } else {
    res.status(401);
    throw new Error('No autorizado, no hay token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('No autorizado como administrador');
  }
};

// Middleware que verifica si el usuario es el 'super admin' (el primer admin creado)
const superAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(401);
    throw new Error('No autorizado como administrador');
  }

  const firstAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 }).select('_id');
  if (!firstAdmin || !req.user._id.equals(firstAdmin._id)) {
    res.status(403);
    throw new Error('Solo el super admin puede realizar esta acción');
  }

  next();
});

module.exports = { protect, admin, superAdmin };

