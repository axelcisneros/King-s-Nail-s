import { toast } from 'react-toastify';

// Show a toast with an Undo button. undoFn should be an async function that attempts to reverse the action.
export const showUndoToast = (message, undoFn, timeout = 5000) => {
  const id = toast.info(
    () => (
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span>{message}</span>
        <button
          onClick={async () => {
            try {
              if (undoFn) await undoFn();
              toast.dismiss(id);
              toast.success('Acción revertida');
            } catch (err) {
              toast.error(`No se pudo deshacer: ${err}`);
            }
          }}
          style={{ marginLeft: '8px' }}
        >
          Deshacer
        </button>
      </div>
    ),
    { autoClose: timeout }
  );
  return id;
};

export default showUndoToast;
