import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './LoginPage.module.css';
import { isValidEmail } from '../../utils/validators';
import useFormValidation from '../../hooks/useFormValidation';
import ValidationIcon from '../../components/ValidationIcon/ValidationIcon';
import LegalModal from '../../components/LegalModal/LegalModal';

const validateLogin = (field, value) => {
  if (field === 'email') {
    if (!isValidEmail(value)) return 'Por favor ingresa un correo válido.';
  }
  if (field === 'password') {
    if (!value) return 'La contraseña no puede estar vacía.';
    if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  }
  return '';
};

const LoginPage = () => {
  const { formData, handleChange, fieldErrors, validateAll, validating, isValid, touched } = useFormValidation({ email: '', password: '' }, validateLogin);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLegalAccept = () => {
    setShowLegal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nextPath = params.get('next');

  // Usar ruta relativa para que Vite proxy maneje las peticiones en dev
  /* const API_URL = import.meta.env.VITE_API_BASE_URL || '/api'; */

  // handleChange provisto por useFormValidation

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
      if (!(await validateAll())) {
        setLoading(false);
        return;
      }
      const user = await login(formData.email, formData.password);
      // Redirigir a la ruta solicitada si existe el query param `next`
      if (nextPath) {
        navigate(nextPath);
        return;
      }
      // Redirigir inmediatamente según rol si no hay `next`
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } catch (err) {
      // El servicio ya lanza un string con el mensaje de error,
      // por lo que no es necesario usar err.toString().
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {showLegal && <LegalModal onAccept={handleLegalAccept} />}
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        {error && <p className={styles.error}>{error}</p>}
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
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
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
        <button type="submit" className={styles.submitButton} disabled={loading || !isValid}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <Link className={styles.redirect} to="/forgot-password">He olvidado mi contraseña?</Link>

        <div className={styles.divider}>
          <span>O</span>
        </div>

        <div className={styles.socialLogin}>
          <a
            href={`/api/users/google`}
            className={`${styles.socialButton} ${styles.googleButton}`}
            onClick={(e) => {
              if (localStorage.getItem('legalAccepted') !== 'true') {
                e.preventDefault();
                setPendingAction(() => () => window.location.href = `/api/users/google`);
                setShowLegal(true);
              }
            }}
          >
            Continuar con Google
          </a>
          <a
            href={`/api/users/facebook`}
            className={`${styles.socialButton} ${styles.facebookButton}`}
            onClick={(e) => {
              if (localStorage.getItem('legalAccepted') !== 'true') {
                e.preventDefault();
                setPendingAction(() => () => window.location.href = `/api/users/facebook`);
                setShowLegal(true);
              }
            }}
          >
            Continuar con Facebook
          </a>
        </div>

        <p className={styles.redirect}>
          No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;