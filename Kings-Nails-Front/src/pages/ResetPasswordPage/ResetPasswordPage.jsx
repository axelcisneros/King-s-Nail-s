import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './ResetPasswordPage.module.css';
import { isStrongPassword } from '../../utils/validators';
import useFormValidation from '../../hooks/useFormValidation';
import ValidationIcon from '../../components/ValidationIcon/ValidationIcon';
import api from '../../config/api';

const validateResetPassword = (field, value, formData) => {
  if (field === 'password') {
    if (!value) return 'La contraseña no puede estar vacía.';
    if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!isStrongPassword(value)) return 'La contraseña debe contener minúscula, mayúscula, número y símbolo.';
  }
  if (field === 'confirmPassword') {
    if (value !== formData.password) return 'Las contraseñas no coinciden.';
  }
  return '';
};

const ResetPasswordPage = () => {
  const { token } = useParams();
  const { formData, handleChange, fieldErrors, validateAll, validating, isValid, touched } = useFormValidation(
    { password: '', confirmPassword: '' },
    validateResetPassword
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!(await validateAll())) {
        setLoading(false);
        return;
      }

      const response = await api.post(`/users/reset-password/${token}`, { password: formData.password });

      // Login automático después del reset
      const { token: authToken, user } = response.data;
      localStorage.setItem('token', authToken);

      // Redirigir según rol
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <h2 className={styles.title}>Nueva Contraseña</h2>
        <p className={styles.description}>
          Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas, números y símbolos.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="password">Nueva Contraseña</label>
          <div className={styles.inputRow}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Ingresa tu nueva contraseña"
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              aria-invalid={fieldErrors.password ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePassword}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
            <ValidationIcon validating={validating.password} error={fieldErrors.password} showOk={touched.password && !fieldErrors.password} message={fieldErrors.password} />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <div className={styles.inputRow}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Confirma tu nueva contraseña"
              aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
              aria-invalid={fieldErrors.confirmPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.togglePassword}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
            <ValidationIcon validating={validating.confirmPassword} error={fieldErrors.confirmPassword} showOk={touched.confirmPassword && !fieldErrors.confirmPassword} message={fieldErrors.confirmPassword} />
          </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading || !isValid}>
          {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
        </button>

        <p className={styles.redirect}>
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
