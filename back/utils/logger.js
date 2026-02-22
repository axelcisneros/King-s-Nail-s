const Log = require('../models/LogModel');

const highlightKeywords = (process.env.LOG_HIGHLIGHTS || 'LEGAL,SECURITY,PAYMENT').split(',').map(k => k.trim()).filter(Boolean);

function detectHighlights(message, meta) {
  const text = [message, JSON.stringify(meta || {})].join(' ').toUpperCase();
  const found = highlightKeywords.filter(k => k && text.includes(k.toUpperCase()));
  return found;
}

async function saveLogToDB(level, message, meta) {
  try {
    const foundHighlights = detectHighlights(message, meta);
    
    // Extraer category y highlightWords manuales si vienen en meta
    let category = undefined;
    let manualHighlights = [];
    let cleanMeta = { ...meta };

    if (meta) {
      if (meta.category) {
        category = meta.category;
        delete cleanMeta.category;
      }
      if (meta.highlightWords && Array.isArray(meta.highlightWords)) {
        manualHighlights = meta.highlightWords;
        delete cleanMeta.highlightWords;
      }
    }

    // Combinar highlights automáticos y manuales sin duplicados
    const allHighlights = [...new Set([...foundHighlights, ...manualHighlights])];

    // Guardar en MongoDB
    await Log.create({
      level,
      message,
      meta: Object.keys(cleanMeta).length > 0 ? cleanMeta : undefined,
      category,
      highlightWords: allHighlights
    });

    // En desarrollo, imprimir en consola para visibilidad
    if (process.env.NODE_ENV !== 'production') {
      const highlightStr = allHighlights.length ? ` [HIGHLIGHTS: ${allHighlights.join(',')}]` : '';
      console.log(`[${level}] ${message}${highlightStr}`, Object.keys(cleanMeta).length > 0 ? cleanMeta : '');
    }
  } catch (error) {
    console.error('Error guardando log en BD:', error);
  }
}

function logGood(message, meta) { saveLogToDB('GOOD', message, meta); }
function logFail(message, meta) { saveLogToDB('FAIL', message, meta); }
function logError(message, meta) { saveLogToDB('ERROR', message, meta); }
function logWarn(message, meta) { saveLogToDB('WARN', message, meta); }
function logInfo(message, meta) { saveLogToDB('INFO', message, meta); }

// Exportamos scheduleCleanup vacío para no romper código existente que lo llame
function scheduleCleanup() {
  // Ya no es necesario, MongoDB maneja la expiración con el índice TTL (expires: '30d')
}

module.exports = { logGood, logFail, logError, logWarn, logInfo, scheduleCleanup };
