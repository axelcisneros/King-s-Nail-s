import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ForgotPasswordPage.module.css';
import { isValidEmail } from '../../utils/validators';
import useFormValidation from '../../hooks/useFormValidation';
import ValidationIcon from '../../components/ValidationIcon/ValidationIcon';
import api from '../../config/api';

const validateForgotPassword = (field, value) => {
  if (field === 'email') {
    if (!isValidEmail(value)) return 'Por favor ingresa un correo válido.';
  }
  return '';
};

const ForgotPasswordPage = () => {
  const { formData, handleChange, fieldErrors, validateAll, validating, isValid, touched } = useFormValidation({ email: '' }, validateForgotPassword);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!(await validateAll())) {
        setLoading(false);
        return;
      }

      const response = await api.post('/users/forgot-password', { email: formData.email });
      setSuccess(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al solicitar recuperación de contraseña');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <h2 className={styles.title}>Recuperar Contraseña</h2>
        <p className={styles.description}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <div className={styles.inputRow}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="Ingresa tu email"
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              aria-invalid={fieldErrors.email ? "true" : "false"}
            />
            <ValidationIcon validating={validating.email} error={fieldErrors.email} showOk={touched.email && !fieldErrors.email} message={fieldErrors.email} />
          </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading || !isValid}>
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>

        <p className={styles.redirect}>
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
