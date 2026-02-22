import { useState, useEffect } from 'react';
import styles from './InstallButton.module.css';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [showPromptAutomatically, setShowPromptAutomatically] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      console.log('💾 beforeinstallprompt capturado');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);

      // Estrategia de mostrar prompt automático después de engagement
      checkUserEngagement(e);
    };

    const checkUserEngagement = (promptEvent) => {
      // Verificar si el usuario ya interactuó con la página
      const hasEngagement = localStorage.getItem('userEngagement');

      // Tiempos ajustables: cambiar a 10000 y 3000 para producción
      const FIRST_VISIT_DELAY = 2000; // 2 segundos para testing (10000 en prod)
      const RETURNING_USER_DELAY = 1000; // 1 segundo para testing (3000 en prod)

      if (!hasEngagement) {
        // Primera visita: esperar delay antes de mostrar
        const engagementTimer = setTimeout(() => {
          localStorage.setItem('userEngagement', 'true');
          setShowPromptAutomatically(true);
          showInstallPrompt(promptEvent);
        }, FIRST_VISIT_DELAY);

        // Limpiar timer si el usuario se va antes
        return () => clearTimeout(engagementTimer);
      } else {
        // Usuario recurrente: mostrar más rápido
        setTimeout(() => {
          setShowPromptAutomatically(true);
          showInstallPrompt(promptEvent);
        }, RETURNING_USER_DELAY);
      }
    };

    const showInstallPrompt = async (promptEvent) => {
      if (!promptEvent) return;

      try {
        console.log('🎯 Mostrando prompt automático basado en engagement');
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        console.log(`👤 Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);

        if (outcome === 'accepted') {
          setShowButton(false);
        }
      } catch (error) {
        console.log('Usuario cerró el prompt o no está disponible');
      }
    };

    const handleAppInstalled = () => {
      console.log('✅ PWA instalada exitosamente');
      setShowButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App ya está instalada');
      setShowButton(false);
    } else {
      // Siempre mostrar el botón en navegador, incluso si el prompt no está disponible aún
      console.log('App no instalada, mostrando botón de instalación');
      setShowButton(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('⚠️ Prompt no disponible, mostrando instrucciones');
      // Mostrar instrucciones amigables si el prompt no está disponible
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const hasEngagement = localStorage.getItem('userEngagement');
      const waitTime = hasEngagement ? '1 segundo' : '2 segundos';

      if (isIOS) {
        alert(`Para instalar en iOS:\n\nOPCIÓN 1 - Automático:\nEspera ${waitTime} y aparecerá el prompt de instalación.\n\nOPCIÓN 2 - Manual:\n1. Toca el botón de compartir 📤\n2. Selecciona "Agregar a pantalla de inicio"\n3. Confirma tocando "Agregar"`);
      } else {
        alert(`Para instalar la aplicación:\n\nOPCIÓN 1 - Automático:\nEspera ${waitTime} y aparecerá el prompt de instalación.\n\nOPCIÓN 2 - Manual:\n1. Toca el menú (⋮ o ⋯)\n2. Selecciona "Instalar app" o "Agregar a pantalla de inicio"\n3. Confirma la instalación`);
      }
      return;
    }

    console.log('🚀 Mostrando prompt de instalación...');

    try {
      // Mostrar el prompt nativo del navegador
      await deferredPrompt.prompt();

      // Esperar la respuesta del usuario
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`👤 Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);

      if (outcome === 'accepted') {
        setShowButton(false);
      }
    } catch (error) {
      console.error('Error al mostrar prompt de instalación:', error);
    } finally {
      setDeferredPrompt(null);
    }
  };  if (!showButton) return null;

  return (
    <button
      className={styles.installButton}
      onClick={handleInstall}
      aria-label="Instalar aplicación"
      type="button"
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  );
};

export default InstallButton;
