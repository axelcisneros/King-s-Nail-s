const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const UserDesign = require('../models/UserDesignModel');
const Appointment = require('../models/AppointmentModel');
const generateTokenAndSetCookie = require('../utils/generateToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const TERMS_VERSION = process.env.TERMS_VERSION || '1.0';
const PRIVACY_VERSION = process.env.PRIVACY_VERSION || '1.0';

// @desc    Registrar un nuevo usuario
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, acceptedLegal, termsVersion = TERMS_VERSION, privacyVersion = PRIVACY_VERSION } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('El usuario ya existe');
  }

  if (!acceptedLegal) {
    res.status(400);
    throw new Error('Debes aceptar los Términos y la Política de Privacidad antes de registrarte');
  }

  // Determinar el rol. Si no hay usuarios en la BD, intentamos crear el primero como 'admin'.
  const isFirstAccount = (await User.countDocuments({})) === 0;
  let role = isFirstAccount ? 'admin' : 'client';

  let user;
  try {
    user = await User.create({ name, email, password, role, legalAcceptedAt: new Date(), termsVersion, privacyVersion });
  } catch (err) {
    // Si hubo un conflicto por índice único parcial (p.ej. otro proceso creó al admin simultáneamente),
    // caemos a 'client' y reintentamos crear el usuario para evitar falla por condición de carrera.
    if (err && err.code === 11000 && isFirstAccount) {
      role = 'client';
      user = await User.create({ name, email, password, role, legalAcceptedAt: new Date(), termsVersion, privacyVersion });
    } else {
      throw err;
    }
  }

  if (user) {
    const { logGood } = require('../utils/logger');
    const token = generateTokenAndSetCookie(res, user._id);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        googleId: user.googleId,
        facebookId: user.facebookId,
        legalAcceptedAt: user.legalAcceptedAt,
        termsVersion: user.termsVersion,
        privacyVersion: user.privacyVersion,
      },
    });
    logGood('Usuario registrado', { userId: user._id.toString(), email: user.email, role: user.role });
  } else {
    res.status(400);
    throw new Error('Datos de usuario inválidos');
  }
});

// @desc    Autenticar usuario y obtener token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // necesitamos incluir la contraseña (select '+password') porque en el esquema
  // password tiene select: false por seguridad. Para poder comparar la contraseña
  // ingresada con el hash almacenado debemos solicitarla explícitamente.
  const user = await User.findOne({ email }).select('+password');

  const { logGood, logFail } = require('../utils/logger');
  if (user && (await user.matchPassword(password))) {
    const token = generateTokenAndSetCookie(res, user._id);
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        googleId: user.googleId,
        facebookId: user.facebookId,
        legalAcceptedAt: user.legalAcceptedAt,
        termsVersion: user.termsVersion,
        privacyVersion: user.privacyVersion,
      },
    });
    logGood('Login exitoso', { userId: user._id.toString(), email: user.email });
  } else {
    logFail('Login fallido', { emailAttempt: email });
    res.status(401);
    throw new Error('Email o contraseña inválidos');
  }
});

// @desc    Obtener el perfil del usuario logueado
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      googleId: user.googleId,
      facebookId: user.facebookId,
      legalAcceptedAt: user.legalAcceptedAt,
      termsVersion: user.termsVersion,
      privacyVersion: user.privacyVersion,
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Actualizar el perfil del usuario (incluyendo contraseña)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password; // El pre-save hook en el modelo se encargará del hash
    }

    const updatedUser = await user.save();

    const token = generateTokenAndSetCookie(res, updatedUser._id); // Generar nueva cookie al actualizar
    res.json({
      token,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        legalAcceptedAt: updatedUser.legalAcceptedAt,
        termsVersion: updatedUser.termsVersion,
        privacyVersion: updatedUser.privacyVersion,
      },
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Eliminar el perfil del usuario logueado
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Eliminar datos asociados al usuario para no dejar datos huérfanos
    // 1. Citas asociadas a este usuario
    await Appointment.deleteMany({ user: req.user._id });
    // 2. Diseños subidos por este usuario
    await UserDesign.deleteMany({ user: req.user._id });

    // 3. Finalmente, eliminar el usuario
    await user.deleteOne();
    res.json({ message: 'Usuario y todos sus datos asociados han sido eliminados' });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Handle Google auth callback, generate token, and redirect
// @route   GET /api/users/google/callback
// @access  Public
const googleAuthCallback = asyncHandler(async (req, res) => {
  // Passport.js nos entrega el usuario en req.user después de una autenticación exitosa
  if (req.user) {
    const user = req.user;
    generateTokenAndSetCookie(res, user._id);

    // Usar la URL del frontend configurada en el entorno
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Redirigimos al frontend a una página de éxito. El frontend se encargará
    // de obtener los datos del usuario desde el endpoint /profile.
    res.redirect(`${frontendUrl}/login-success`);
  } else {
    res.status(401).redirect('/login?error=auth_failed');
  }
});

// @desc    Refrescar access token usando refresh token cookie
// @route   POST /api/users/refresh
// @access  Public (pero requiere cookie refreshToken)
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error('No refresh token present');
  }

  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    // Generar nuevo access token y actualizar cookie corta
    const { accessToken } = require('../utils/generateTokens')(res, user._id);
    res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token: accessToken });
  } catch (err) {
    res.cookie('refreshToken', '', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      expires: new Date(0) 
    });
    res.status(401);
    throw new Error('Refresh token invalid or expired');
  }
});

// @desc    Cerrar sesión de usuario y limpiar cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0),
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0),
  });
  const { logInfo } = require('../utils/logger');
  res.status(200).json({ message: 'Sesión cerrada correctamente' });
  if (req.user) {
    logInfo('Logout usuario', { userId: req.user._id.toString(), email: req.user.email });
  } else {
    logInfo('Logout sin usuario asociado');
  }
};

module.exports = {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  refreshToken,
  googleAuthCallback,
  facebookAuthCallback: asyncHandler(async (req, res) => {
    if (req.user) {
      const user = req.user;
      generateTokenAndSetCookie(res, user._id);
      
      // Usar la URL del frontend configurada en el entorno
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      // Redirigimos al frontend a una página de éxito.
      res.redirect(`${frontendUrl}/login-success`);
    } else {
      res.status(401).redirect('/login?error=facebook_auth_failed');
    }
  }),
  acceptLegal: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    // Permitir que el frontend envíe explícitamente las versiones aceptadas actuales
    const { termsVersion: incomingTerms, privacyVersion: incomingPrivacy } = req.body || {};
    const nextTerms = incomingTerms || TERMS_VERSION;
    const nextPrivacy = incomingPrivacy || PRIVACY_VERSION;


    user.legalAcceptedAt = new Date();
    user.termsVersion = nextTerms;
    user.privacyVersion = nextPrivacy;
    await user.save();


    const { logGood } = require('../utils/logger');
    res.json({
      _id: user._id,
      legalAcceptedAt: user.legalAcceptedAt,
      termsVersion: user.termsVersion,
      privacyVersion: user.privacyVersion,
    });
    logGood('Aceptación legal actualizada', { userId: user._id.toString(), termsVersion: user.termsVersion, privacyVersion: user.privacyVersion });
  }),
  // @desc    Solicitar reset de contraseña
  // @route   POST /api/users/forgot-password
  // @access  Public
  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('No existe un usuario con ese correo electrónico');
    }

    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash del token para guardar en BD
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutos
    
    await user.save();

    // URL de reset
    const frontendUrl = process.env.TUNNEL_FRONTEND_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    // Email HTML
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Recuperación de Contraseña</h2>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #E91E63; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Restablecer Contraseña</a>
        <p>Este enlace expirará en 30 minutos.</p>
        <p>Si no solicitaste este cambio, ignora este correo y tu contraseña permanecerá sin cambios.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">Kings Nails - Tu salón de belleza de confianza</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Recuperación de Contraseña - Kings Nails',
        html: message,
      });

      res.json({ message: 'Correo de recuperación enviado exitosamente' });
    } catch (error) {
      console.error('Error enviando email:', error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500);
      throw new Error('Error al enviar el correo de recuperación');
    }
  }),
  // @desc    Resetear contraseña con token
  // @route   POST /api/users/reset-password/:token
  // @access  Public
  resetPassword: asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Hash del token recibido para comparar con el de la BD
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Token inválido o expirado');
    }

    // Actualizar contraseña
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const { logGood } = require('../utils/logger');
    logGood('Contraseña restablecida', { userId: user._id.toString(), email: user.email });

    // Generar token de sesión
    const authToken = generateTokenAndSetCookie(res, user._id);

    res.json({
      message: 'Contraseña actualizada exitosamente',
      token: authToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }),
};