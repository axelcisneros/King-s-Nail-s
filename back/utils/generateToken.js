const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true, // Impide el acceso desde JavaScript en el cliente
    // En desarrollo permitimos sameSite:'none' y secure:false para que el navegador envíe la cookie entre localhost:3000 <-> localhost:5000
  secure: process.env.NODE_ENV === 'production', // true solo en producción
  // Evitar que navegadores modernos rechacen la cookie en dev: usar 'lax' en desarrollo
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días en milisegundos
  });

  return token; // Además de setear la cookie, devolvemos el token para que el frontend pueda guardarlo si lo desea
};

module.exports = generateTokenAndSetCookie;