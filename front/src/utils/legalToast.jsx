import { toast } from 'react-toastify';

export const showLegalUpdateToast = (onAccept, timeout = false) => {
  const id = toast.info(
    () => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14 }}>
          Hemos actualizado nuestros Términos y Privacidad. Por favor revísalos.
        </span>
        <a
          href="/terminos"
          style={{ textDecoration: 'underline', fontWeight: 600, fontSize: 12 }}
          target="_blank"
          rel="noreferrer"
        >
          Ver
        </a>
        <button
          onClick={async () => {
            try {
              await onAccept?.();
              toast.dismiss(id);
              toast.success('Gracias por aceptar las nuevas condiciones');
            } catch {
              toast.error('No se pudo registrar tu aceptación');
            }
          }}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            background: '#10b981',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Aceptar
        </button>
      </div>
    ),
    { autoClose: timeout || false, closeOnClick: false }
  );
  return id;
};

export default showLegalUpdateToast;
