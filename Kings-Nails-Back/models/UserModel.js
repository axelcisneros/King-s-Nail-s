const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    name: { type: String, required: [true, 'El nombre es requerido'] },
    email: {
      type: String,
      required: [true, 'El correo es requerido'],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Por favor ingresa un correo electrónico válido'],
    },
    password: {
      type: String,
      // requerido sólo para usuarios sin OAuth (googleId)
      required: function () {
        return !this.googleId && !this.facebookId;
      },
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      validate: {
        validator: function (v) {
          if (!v) return true; // permitir vacío para usuarios OAuth
          return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(v);
        },
        message: 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un símbolo',
      },
      select: false,
    }, // No es requerida para usuarios de OAuth
    role: {
      type: String,
      required: true,
      enum: ['client', 'admin'],
      default: 'client',
    },
    // Aceptación legal (Términos y Política de Privacidad) requerida antes de usar la plataforma.
    legalAcceptedAt: { type: Date },
    termsVersion: { type: String }, // versión de términos aceptada (permite futuras migraciones legales)
    privacyVersion: { type: String }, // versión de política aceptada
    // Token para reset de contraseña
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Asegurar que solo exista un único usuario con role: 'admin' (índice parcial único).
// Esto evita condiciones de carrera donde dos registros simultáneos creen dos admins.
userSchema.index({ role: 1 }, { unique: true, partialFilterExpression: { role: 'admin' } });

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;