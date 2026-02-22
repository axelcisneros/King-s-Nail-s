import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import styles from './ClientProfilePage.module.css';
import { isValidEmail, isStrongPassword } from '../../utils/validators';
import useFormValidation from '../../hooks/useFormValidation';
import ValidationIcon from '../../components/ValidationIcon/ValidationIcon';
import ConfirmToast from '../../components/ConfirmToast/ConfirmToast';

const ClientProfilePage = () => {
  const { user, updateProfile, deleteProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = (fieldName, value, data) => {
    if (fieldName === 'name') {
      // No validar nombre para usuarios OAuth ya que está deshabilitado
      if (user?.googleId || user?.facebookId) return '';
      return value && value.length >= 2 ? '' : 'El nombre debe tener al menos 2 caracteres.';
    }
    if (fieldName === 'email') {
      // No validar email para usuarios OAuth ya que está deshabilitado
      if (user?.googleId || user?.facebookId) return '';
      return isValidEmail(value) ? '' : 'Por favor ingresa un correo válido.';
    }
    if (fieldName === 'password') {
      if (!value) return '';
      // No validar contraseña para usuarios OAuth
      if (user?.googleId || user?.facebookId) return '';
      if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
      return isStrongPassword(value)
        ? ''
        : 'La contraseña debe contener minúscula, mayúscula, número y símbolo.';
    }
    if (fieldName === 'confirmPassword') {
      if (!data.password) return '';
      // No validar confirmación para usuarios OAuth
      if (user?.googleId || user?.facebookId) return '';
      return value === data.password ? '' : 'Las contraseñas no coinciden.';
    }
    return '';
  };

  const { formData, setFormData, fieldErrors, handleChange, validateAll, validating, isValid, touched } = useFormValidation({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }, validate);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, setFormData]);

  // handleChange provided by hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Los usuarios OAuth no pueden actualizar nada
    if (isOAuthUser) {
      toast.info('Los datos de tu perfil se gestionan a través de tu proveedor OAuth.');
      return;
    }

    // validate all fields via hook
    const ok = validateAll();
    if (!ok) return;

    setLoading(true);
    try {
      const dataToUpdate = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        dataToUpdate.password = formData.password;
      }

      await updateProfile(dataToUpdate);
      toast.success('¡Perfil actualizado con éxito!');
      // Limpiar campos de contraseña después de un éxito
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.toString());
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario está autenticado con OAuth (Google o Facebook)
  const isOAuthUser = user?.googleId || user?.facebookId;

  if (!user) {
    return null;
  }

  const handleDeleteProfile = async () => {
    const onConfirm = async () => {
      try {
        await deleteProfile();
        // El AuthProvider se encarga de limpiar el estado y localStorage.
        // El ProtectedRoute redirigirá automáticamente al usuario a /login.
        toast.success('Tu cuenta ha sido eliminada exitosamente.');
      } catch (err) {
        toast.error(err.toString());
      }
    };

    toast(<ConfirmToast onConfirm={onConfirm} message="Estás absolutamente segura? Esta acción es permanente." />, {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      position: 'top-center',
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
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
            autoComplete='name'
            placeholder="Ingresa tu nombre completo"
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            aria-invalid={fieldErrors.name ? "true" : "false"}
            minLength="2"
            disabled={isOAuthUser}
          />
          <ValidationIcon validating={validating.name} error={fieldErrors.name} showOk={touched.name && !fieldErrors.name} />
        </div>
        {isOAuthUser && <p className={styles.hint}>El nombre se gestiona a través de {user.googleId ? 'Google' : 'Facebook'}</p>}
        {fieldErrors.name && <p id="name-error" className={styles.error}>{fieldErrors.name}</p>}
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
            autoComplete='email'
            placeholder="Ingresa tu email"
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            aria-invalid={fieldErrors.email ? "true" : "false"}
            disabled={isOAuthUser}
          />
          <ValidationIcon validating={validating.email} error={fieldErrors.email} showOk={touched.email && !fieldErrors.email} />
        </div>
        {isOAuthUser && <p className={styles.hint}>El email se gestiona a través de {user.googleId ? 'Google' : 'Facebook'}</p>}
        {fieldErrors.email && <p id="email-error" className={styles.error}>{fieldErrors.email}</p>}
      </div>
      {!isOAuthUser && (
        <>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Nueva Contraseña (opcional)</label>
            <div className={styles.inputRow}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Dejar en blanco para no cambiar"
                autoComplete='new-password'
                aria-describedby={fieldErrors.password ? "password-error" : "password-help"}
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
              <ValidationIcon validating={validating.password} error={fieldErrors.password} showOk={touched.password && !fieldErrors.password} />
            </div>
            <p id="password-help" className={styles.hint}>Mínimo 8 caracteres con mayúscula, minúscula, número y símbolo</p>
            {fieldErrors.password && <p id="password-error" className={styles.error}>{fieldErrors.password}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
            <div className={styles.inputRow}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={!formData.password}
                autoComplete='new-password'
                placeholder="Confirma tu nueva contraseña"
                aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
                aria-invalid={fieldErrors.confirmPassword ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.togglePassword}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={!formData.password}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
              <ValidationIcon validating={validating.confirmPassword} error={fieldErrors.confirmPassword} showOk={touched.confirmPassword && !fieldErrors.confirmPassword} />
            </div>
            {fieldErrors.confirmPassword && <p id="confirm-password-error" className={styles.error}>{fieldErrors.confirmPassword}</p>}
          </div>
        </>
      )}
      <button type="submit" className={styles.submitButton} disabled={loading || !isValid || isOAuthUser}>
        {loading
          ? 'Actualizando...'
          : isOAuthUser
            ? `Datos Gestionados por ${user.googleId ? 'Google' : 'Facebook'}`
            : 'Actualizar Perfil'
        }
      </button>
      {isOAuthUser && (
        <div className={styles.oauthNotice}>
          <p>🔒 Cuenta vinculada con {user.googleId ? 'Google' : 'Facebook'}</p>
          <p>Tu perfil completo (nombre, email y contraseña) se gestiona directamente en {user.googleId ? 'Google' : 'Facebook'}.</p>
          <p>No es posible editar estos datos desde aquí.</p>
        </div>
      )}
      </form>

      <div className={`${styles.section} ${styles.dangerZone}`}>
        <h2 className={`${styles.sectionTitle} ${styles.sectionTitleDanger}`}>
          Zona de Peligro
        </h2>
        <p>La siguiente acción es permanente. Por favor, ten cuidado.</p>
        <button onClick={handleDeleteProfile} className={styles.dangerButton}>
          Eliminar mi Cuenta
        </button>
      </div>
    </>
  );
};

export default ClientProfilePage;