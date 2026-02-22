// Versiones legales obtenidas desde variables de entorno Vite.
// Edita solo el archivo .env del frontend (prefijo VITE_) y el .env del backend.
export const TERMS_VERSION = import.meta.env.VITE_TERMS_VERSION || '1.0';
export const PRIVACY_VERSION = import.meta.env.VITE_PRIVACY_VERSION || '1.0';

export const isLegalUpToDate = () => {
  const t = localStorage.getItem('termsVersion');
  const p = localStorage.getItem('privacyVersion');
  return t === TERMS_VERSION && p === PRIVACY_VERSION;
};
