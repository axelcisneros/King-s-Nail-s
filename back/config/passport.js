const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = require('../models/UserModel');

module.exports = function (passport) {
  // Configuración de la estrategia de Google
  const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL || '/api/users/google/callback';
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: googleCallbackURL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      } else {
        const isFirstAccount = (await User.countDocuments({})) === 0;
        let role = isFirstAccount ? 'admin' : 'client';
        const TERMS_VERSION = process.env.TERMS_VERSION || '1.0';
        const PRIVACY_VERSION = process.env.PRIVACY_VERSION || '1.0';
        const baseUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          role,
          legalAcceptedAt: new Date(),
          termsVersion: TERMS_VERSION,
          privacyVersion: PRIVACY_VERSION,
        };
        try {
          user = await User.create(baseUser);
        } catch (err) {
          if (err && err.code === 11000 && isFirstAccount) {
            user = await User.create({ ...baseUser, role: 'client' });
          } else {
            throw err;
          }
        }
        return done(null, user);
      }
    } catch (err) {
      console.error(err);
      return done(err, null);
    }
  }));

  // Configuración de la estrategia de Facebook
  const facebookCallbackURL = process.env.FACEBOOK_CALLBACK_URL || '/api/users/facebook/callback';
  passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: facebookCallbackURL,
    profileFields: ['id', 'displayName', 'emails'], // Campos que solicitamos a Facebook
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });

      if (user) {
        return done(null, user);
      } else {
        const isFirstAccount = (await User.countDocuments({})) === 0;
        let role = isFirstAccount ? 'admin' : 'client';
        const TERMS_VERSION = process.env.TERMS_VERSION || '1.0';
        const PRIVACY_VERSION = process.env.PRIVACY_VERSION || '1.0';
        const baseUser = {
          facebookId: profile.id,
          name: profile.displayName,
          email: profile.emails ? profile.emails[0].value : '',
          role,
          legalAcceptedAt: new Date(),
          termsVersion: TERMS_VERSION,
          privacyVersion: PRIVACY_VERSION,
        };
        try {
          user = await User.create(baseUser);
        } catch (err) {
          if (err && err.code === 11000 && isFirstAccount) {
            user = await User.create({ ...baseUser, role: 'client' });
          } else {
            throw err;
          }
        }
        return done(null, user);
      }
    } catch (err) {
      console.error(err);
      return done(err, null);
    }
  }));

  // Estas funciones son necesarias para que passport maneje las sesiones.
  // Aunque usaremos JWT (sin estado), son una buena práctica.
  passport.serializeUser((user, done) => {
    // The id property may be an ObjectId, which is not directly serializable.
    // Ensure that user.id is converted to a string before being passed to done().
    done(null, user.id.toString());
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};