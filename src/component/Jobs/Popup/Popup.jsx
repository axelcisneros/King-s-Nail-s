import { useEffect } from "react";
import "@assets/blocks/Popup.css"

export default function Popup (props) {
    const { onClose, children } = props;

    useEffect(() => {
      function handleEscKey(e) {
          if (e.key === 'Escape') {
              onClose();
          }
      }

      document.addEventListener('keydown', handleEscKey);
      return () => {
          document.removeEventListener('keydown', handleEscKey);
      };
  }, [onClose]);

  function handleClickOutside(e) {
    if (e.target.classList.contains('popup')) {
        onClose();
    }
}

    return (
        <div className="popup" onClick={handleClickOutside}>
          <button
          aria-label="Close modal"
          type="button"
          className="popup__button popup__button_close"
          onClick={onClose}
          />
          {children}
      </div>
    )
}