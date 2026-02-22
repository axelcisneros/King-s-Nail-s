import api from '../config/api';

// Niveles soportados: good | fail | info | warn | error | critical
// category: para clasificar (auth, legal, ui, performance, etc.)
// highlightWords: lista opcional de palabras que queremos resaltar explícitamente

async function send(level, message, { meta = {}, category = 'generic', highlightWords = [] } = {}) {
  const payload = { level, message, meta: { ...meta, highlightWords }, category };
  try { await api.post('/logs', payload); } catch { /* Silenciar errores de logging */ }
}

export const logGood = (message, opts) => send('good', message, opts);
export const logFail = (message, opts) => send('fail', message, opts);
export const logInfo = (message, opts) => send('info', message, opts);
export const logWarn = (message, opts) => send('warn', message, opts);
export const logError = (message, opts) => send('error', message, opts);
export const logCritical = (message, opts) => send('critical', message, opts);

