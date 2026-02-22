import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from '../LoginPage/LoginPage.module.css'; // Reutilizamos los estilos de Login
import { isValidEmail, isStrongPassword, minLength } from '../../utils/validators';
import useFormValidation from '../../hooks/useFormValidation';
import ValidationIcon from '../../components/ValidationIcon/ValidationIcon';
import LegalModal from '../../components/LegalModal/LegalModal';

const validateRegister = (field, value, formData) => {
  if (field === 'name') {
    if (!minLength(value, 2)) return 'Por favor ingresa tu nombre (al menos 2 caracteres).';
  }
  if (field === 'email') {
    if (!isValidEmail(value)) return 'Por favor ingresa un correo válido.';
  }
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

const RegisterPage = () => {
  const { formData, handleChange, fieldErrors, validateAll, validating, isValid, touched } = useFormValidation({ name: '', email: '', password: '', confirmPassword: '' }, validateRegister);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLegalAccept = () => {
    setShowLegal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nextPath = params.get('next');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.getItem('legalAccepted') !== 'true') {
      setPendingAction(() => () => handleSubmit(e));
      setShowLegal(true);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const ok = await validateAll();
      if (!ok) {
        setLoading(false);
        return;
      }
      const user = await register(formData.name, formData.email, formData.password);
      if (nextPath) {
        navigate(nextPath);
        return;
      }
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {showLegal && <LegalModal onAccept={handleLegalAccept} />}
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <h2 className={styles.title}>Crear Cuenta</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputGroup}>
          <label htmlFor="name">Nombre</label>
          <div className={styles.inputRow}>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="given-name"
              placeholder="Ingresa tu nombre completo"
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              aria-invalid={fieldErrors.name ? "true" : "false"}
              minLength="2"
            />
            <ValidationIcon validating={validating.name} error={fieldErrors.name} showOk={touched.name && !fieldErrors.name} message={fieldErrors.name} />
          </div>
        </div>
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
        <div className={styles.inputGroup}>
          <label htmlFor="password">Contraseña</label>
          <div className={styles.inputRow}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              aria-invalid={fieldErrors.password ? "true" : "false"}
              minLength="8"
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
              placeholder="Confirma tu contraseña"
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
          {loading ? (
            <>
              ⏳ Creando cuenta...
            </>
          ) : 'Registrarse'}
        </button>

        <p className={styles.redirect}>
          Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;