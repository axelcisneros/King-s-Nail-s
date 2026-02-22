import { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from '../components/Modal/Modal';
import { ConfirmContext } from './ConfirmContext';

export const ConfirmProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      const id = Date.now() + Math.random();
      const item = { id, options, resolve };
      setQueue((q) => [...q, item]);
    });
  }, []);

  const handleClose = (id, result) => {
    setQueue((q) => {
      const item = q.find((i) => i.id === id);
      if (item) item.resolve(result);
      return q.filter((i) => i.id !== id);
    });
  };

  const current = queue[0];
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (current) {
      // focus first actionable element when modal opens
      setTimeout(() => {
        if (confirmButtonRef.current) confirmButtonRef.current.focus();
      }, 0);
    }
  }, [current]);

  const onKeyDown = (e) => {
    // trap simple tabbing between confirm and cancel
    if (!current) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose(current.id, false);
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      // toggle focus
      if (document.activeElement === confirmButtonRef.current && cancelButtonRef.current) {
        cancelButtonRef.current.focus();
      } else if (confirmButtonRef.current) {
        confirmButtonRef.current.focus();
      }
    }
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {current && (
        <Modal isOpen onClose={() => handleClose(current.id, false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" onKeyDown={onKeyDown} tabIndex={-1}>
            <h3 id="confirm-title">{current.options.title || 'Confirmar'}</h3>
            <p>{current.options.message || 'Deseas continuar?'}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
              <button
                ref={confirmButtonRef}
                onClick={() => handleClose(current.id, true)}
                style={current.options.variant === 'danger' ? { background: '#d9534f', color: '#fff', border: 'none', padding: '8px 12px' } : {}}
              >
                {current.options.confirmText || 'Sí'}
              </button>
              <button ref={cancelButtonRef} onClick={() => handleClose(current.id, false)}>{current.options.cancelText || 'Cancelar'}</button>
            </div>
          </div>
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
};

ConfirmProvider.propTypes = {
  children: PropTypes.node,
};

export default ConfirmProvider;

