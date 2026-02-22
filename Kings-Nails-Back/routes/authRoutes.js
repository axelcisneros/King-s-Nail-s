const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  registerUser,
  authUser,
  logoutUser,
  refreshToken,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  googleAuthCallback,
  facebookAuthCallback,
  acceptLegal,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route('/logout').post(logoutUser);
router.route('/refresh').post(refreshToken);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').post(resetPassword);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

// Aceptar/re-aceptar términos y política (requiere sesión)
router.route('/legal/accept').post(protect, acceptLegal);

// Rutas de autenticación con Google
// @desc    Iniciar autenticación con Google
// @route   GET /api/users/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Callback de Google
// @route   GET /api/users/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleAuthCallback
);

// Rutas de autenticación con Facebook
// @desc    Iniciar autenticación con Facebook
// @route   GET /api/users/facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

// @desc    Callback de Facebook
// @route   GET /api/users/facebook/callback
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  facebookAuthCallback
);

module.exports = router;