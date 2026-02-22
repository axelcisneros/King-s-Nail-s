import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Router from './routes/Router';
import './index.css';
import ConfirmProvider from './context/ConfirmProvider';

// Ocultar splash screen cuando React esté listo
const hideSplash = () => {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.classList.add('hidden');
    setTimeout(() => splash.remove(), 300);
  }
};

// Restaurado: uso de createBrowserRouter + future flags para evitar warnings y mantener estructura previa
const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <AuthProvider>
        <Router />
      </AuthProvider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfirmProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }} />
    </ConfirmProvider>
  </React.StrictMode>
);

// Ocultar splash tras renderizado inicial
setTimeout(hideSplash, 100);

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado:', registration.scope);

        // Verificar actualizaciones cada 60 segundos
        setInterval(() => {
          registration.update();
        }, 60000);

        // Detectar nueva versión disponible
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Hay una nueva versión, notificar al usuario
              if (confirm('Nueva versión disponible. Actualizar ahora?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.log('Error al registrar Service Worker:', error);
      });

    // Recargar cuando el nuevo SW tome control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}