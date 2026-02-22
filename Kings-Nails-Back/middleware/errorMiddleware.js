const notFound = (req, res, next) => {
  const error = new Error(`No encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const { logError } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log detallado del error para debugging
  const errorMeta = {
    message: err.message,
    stack: err.stack,
    statusCode,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    file: req.file ? { fieldname: req.file.fieldname, mimetype: req.file.mimetype, size: req.file.size } : 'No file'
  };
  console.error('Error capturado:', errorMeta);
  logError(err.message, errorMeta);

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };