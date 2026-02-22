const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { logGood, logFail, logError, logWarn, logInfo } = require('../utils/logger');

// Recibir logs del frontend
router.post('/', protect, (req, res) => {
  const { level = 'info', message, meta, category } = req.body || {};
  if (!message) {
    return res.status(400).json({ message: 'Mensaje requerido' });
  }
  const payloadMeta = { source: 'frontend', category: category || 'generic', ...(meta || {}) };
  switch (level.toLowerCase()) {
    case 'good':
    case 'success':
      logGood(message, payloadMeta); break;
    case 'fail':
    case 'error':
      logFail(message, payloadMeta); break;
    case 'warn':
      logWarn(message, payloadMeta); break;
    case 'info':
      logInfo(message, payloadMeta); break;
    case 'critical':
      logError(message, payloadMeta); break;
    default:
      logInfo(message, payloadMeta); break;
  }
  res.json({ status: 'ok' });
});

module.exports = router;
