import { useState, useRef } from 'react';

// useFormValidation(initialValues, validateFn, options)
// validateFn(fieldName, value, formData) => error string | '' | Promise<string|''>
export default function useFormValidation(initialValues = {}, validateFn, options = {}) {
  const { debounceMs = 300 } = options;

  const [formData, setFormData] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [validating, setValidating] = useState({});

  const timers = useRef({});
  const validateToken = useRef({});

  const runValidation = async (name, value, data, token) => {
    if (typeof validateFn !== 'function') return '';
    try {
      const result = validateFn(name, value, data);
      const err = result instanceof Promise ? await result : result;
      // ignore if token changed (race)
      if (validateToken.current[name] !== token) return;
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
      setValidating((prev) => ({ ...prev, [name]: false }));
  } catch {
      if (validateToken.current[name] !== token) return;
      setFieldErrors((prev) => ({ ...prev, [name]: 'Error de validación' }));
      setValidating((prev) => ({ ...prev, [name]: false }));
    }
  };

  const scheduleValidation = (name, value, data) => {
    // clear previous timer
    if (timers.current[name]) clearTimeout(timers.current[name]);
    // create token for this validation run
    const token = (validateToken.current[name] || 0) + 1;
    validateToken.current[name] = token;
    setValidating((prev) => ({ ...prev, [name]: true }));
    timers.current[name] = setTimeout(() => {
      runValidation(name, value, data, token);
      timers.current[name] = null;
    }, debounceMs);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const effectiveValue = type === 'file' ? (files && files[0]) : value;
    setFormData((prev) => ({ ...prev, [name]: effectiveValue }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (typeof validateFn === 'function') {
      scheduleValidation(name, effectiveValue, { ...formData, [name]: effectiveValue });
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateAll = async () => {
    if (typeof validateFn !== 'function') return true;
    const keys = Object.keys(formData);
    const newErrors = {};
    // mark validating for all
    const newValidating = {};
    keys.forEach(k => newValidating[k] = true);
    setValidating(newValidating);

    for (const key of keys) {
      try {
        const result = validateFn(key, formData[key], formData);
        const err = result instanceof Promise ? await result : result;
        newErrors[key] = err || '';
  } catch {
        newErrors[key] = 'Error de validación';
      }
    }
    setFieldErrors(newErrors);
    // clear validating
    setValidating({});
    return Object.values(newErrors).every((v) => !v);
  };

  const reset = (values = initialValues) => {
    // clear timers
    Object.values(timers.current).forEach(t => { if (t) clearTimeout(t); });
    timers.current = {};
    validateToken.current = {};
    setFormData(values);
    setFieldErrors({});
    setTouched({});
    setValidating({});
  };

  const isValid = Object.values(fieldErrors).every((v) => !v) && !Object.values(validating).some(Boolean);

  return {
    formData,
    setFormData,
    fieldErrors,
    setFieldErrors,
    handleChange,
    validateAll,
    reset,
    touched,
    validating,
    isValid,
  };
}
