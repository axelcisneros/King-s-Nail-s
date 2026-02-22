import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TERMS_VERSION, PRIVACY_VERSION } from '../config/legal';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import authService from '../services/authService';
import { showLegalUpdateToast } from '../utils/legalToast.jsx';
import { logGood, logFail, logInfo } from '../utils/logger';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const legalToastShown = useRef(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData = await authService.checkSession();
        if (userData) {
          setUser(userData);
          if (
            userData.termsVersion !== TERMS_VERSION ||
            userData.privacyVersion !== PRIVACY_VERSION
          ) {
            localStorage.setItem('legalAccepted', 'false');
            if (!legalToastShown.current) {
              legalToastShown.current = true;
              const toastId = showLegalUpdateToast(async () => {
                try {
                  const data = await authService.acceptLegal();
                  localStorage.setItem('legalAccepted', 'true');
                  localStorage.setItem('termsVersion', data.termsVersion);
                  localStorage.setItem('privacyVersion', data.privacyVersion);
                  setUser((prev) => (prev ? { ...prev, termsVersion: data.termsVersion, privacyVersion: data.privacyVersion, legalAcceptedAt: data.legalAcceptedAt } : prev));
                  logGood('Frontend aceptación legal', { meta: { termsVersion: data.termsVersion, privacyVersion: data.privacyVersion }, category: 'legal', highlightWords: ['LEGAL','TERMS'] });
                } catch (e) {
                  logFail('Frontend error aceptación legal', { meta: { error: e?.message }, category: 'legal', highlightWords: ['ERROR','LEGAL'] });
                  console.error('Error aceptando términos:', e);
                }
              });
            }
          } else {
            localStorage.setItem('legalAccepted', 'true');
            localStorage.setItem('termsVersion', userData.termsVersion || TERMS_VERSION);
            localStorage.setItem('privacyVersion', userData.privacyVersion || PRIVACY_VERSION);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = useCallback(async (email, password) => {
    if (localStorage.getItem('legalAccepted') !== 'true') {
      throw 'Debes aceptar los Términos y la Política de Privacidad antes de iniciar sesión.';
    }
    const { user: userData } = await authService.login(email, password);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (name, email, password) => {
    if (localStorage.getItem('legalAccepted') !== 'true') {
      throw 'Debes aceptar los Términos y la Política de Privacidad antes de registrarte.';
    }
    const { user: userData } = await authService.register(name, email, password);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Falló la llamada de logout al backend, pero se procederá a limpiar el estado local:', error);
    } finally {
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const { user: updatedUserData } = await authService.updateProfile(profileData);
    setUser(updatedUserData);
    return updatedUserData;
  }, []);

  const deleteProfile = useCallback(async () => {
    await authService.deleteProfile();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      updateProfile,
      deleteProfile,
      isAuthenticated: !!user,
      legalAccepted: localStorage.getItem('legalAccepted') === 'true',
      loading,
    }),
    [user, loading, login, register, logout, updateProfile, deleteProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      <ToastContainer position="top-right" autoClose={8000} theme="dark" style={{ zIndex: 99999 }} />
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};