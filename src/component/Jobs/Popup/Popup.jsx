import { useEffect } from "react";
import "@assets/blocks/Popup.css";
import PropTypes from "prop-types";

export default function Popup(props) {
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

Popup.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

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