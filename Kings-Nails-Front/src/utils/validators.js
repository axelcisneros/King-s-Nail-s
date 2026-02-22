// Utilidades de validación reutilizables
export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /.+@.+\..+/;
  return re.test(email);
};

export const isStrongPassword = (pwd) => {
  if (!pwd) return false;
  if (pwd.length < 8) return false;
  const re = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/;
  return re.test(pwd);
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7;
};

export const isFutureDate = (iso) => {
  if (!iso) return false;
  const d = new Date(iso);
  return !isNaN(d.getTime()) && d > new Date();
};

export const isPositiveNumber = (v) => {
  const n = Number(v);
  return !isNaN(n) && n > 0;
};

export const minLength = (v, n) => {
  if (v == null) return false;
  return String(v).length >= n;
};

// Named exports only (no default export) to avoid ambiguity when importing
