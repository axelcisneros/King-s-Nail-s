import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook personalizado para usar el contexto fácilmente.
// Añadimos una verificación para asegurar que se usa dentro del proveedor.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};