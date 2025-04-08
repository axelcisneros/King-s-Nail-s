import { useState } from "react";
import Logo from "@component/Header/Logo/Logo";
import Popup from "./Popup/Popup";
import ImagePopup from "./Popup/ImagePopup/ImagePopup";
import "@assets/blocks/Jobs.css";
import PropTypes from "prop-types";

function Jobs({ images, popup, onOpenPopup, onClosePopup }) {
  const [currentIndex, setCurrentIndex] = useState(null);

  function handleCardClick(index) {
      setCurrentIndex(index);
      onOpenPopup({ children:
          <ImagePopup
              images={images}
              currentIndex={index}
              setCurrentIndex={setCurrentIndex}
          />
      });
  }

  return (
      <div className="jobs">
          <h2 className="jobs__title">
              Galería de trabajos
              <Logo className="jobs__logo"/>
          </h2>
          <div className="jobs__gallery">
              {images.map((src, index) => (
                  <img
                      key={index}
                      className="jobs__gallery-item"
                      src={src}
                      alt={`Trabajo ${index + 1}`}
                      onClick={() => handleCardClick(index)}
                  />
              ))}
          </div>
          {popup && (
              <Popup onClose={onClosePopup}>
                  <ImagePopup
                      images={images}
                      currentIndex={currentIndex}
                      setCurrentIndex={setCurrentIndex}
                  />
              </Popup>
          )}
      </div>
  );
}
Jobs.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    popup: PropTypes.shape({
        children: PropTypes.node
    }),
    onOpenPopup: PropTypes.func.isRequired,
    onClosePopup: PropTypes.func.isRequired,
};

export default Jobs;