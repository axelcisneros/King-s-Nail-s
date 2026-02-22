const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

// @desc    Obtener todos los usuarios (solo para admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Eliminar un usuario (solo para admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Evitar que un admin se elimine a sí mismo
    if (req.user._id.equals(user._id)) {
      res.status(400);
      throw new Error('No puedes eliminar tu propia cuenta de administrador.');
    }
    await user.deleteOne();
    res.json({ message: 'Usuario eliminado correctamente.' });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado.');
  }
});

// @desc    Cambiar el rol de un usuario (promover/downgrade)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/SuperAdmin
const setUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body; // esperar 'admin' o 'client'
  if (!['admin', 'client'].includes(role)) {
    res.status(400);
    throw new Error('Rol inválido');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }

  // El primer admin (super admin) es el único que puede promover o degradar.
  // Verificamos si req.user es efectivamente el super admin (el primer creado con role 'admin').
  const firstAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 }).select('_id');
  if (!firstAdmin || !req.user._id.equals(firstAdmin._id)) {
    res.status(403);
    throw new Error('Solo el super admin puede cambiar roles');
  }

  // Evitar que el super admin se degrade a sí mismo
  if (user._id.equals(firstAdmin._id) && role !== 'admin') {
    res.status(400);
    throw new Error('No puedes degradar al super admin');
  }

  user.role = role;
  await user.save();
  res.json({ message: `Rol actualizado a ${role}` });
});

module.exports = {
  getUsers,
  deleteUser,
  setUserRole,
};