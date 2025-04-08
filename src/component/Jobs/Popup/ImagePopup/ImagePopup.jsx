import PropTypes from 'prop-types';

export default function ImagePopup({ images, currentIndex, setCurrentIndex }) {
  function handleNext() {
      setCurrentIndex((prev) => (prev + 1) % images.length);
  }

  function handlePrev() {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  return (
      <div className="popup__images">
          <div className="popup__content-image">
              <button
                  className="popup__button popup__button_prev"
                  onClick={handlePrev}
                  aria-label="Imagen anterior"
              ></button>

              <img className="popup__image" src={images[currentIndex]} alt={`Trabajo ${currentIndex + 1}`} />

              <button
                  className="popup__button popup__button_next"
                  onClick={handleNext}
                  aria-label="Imagen siguiente"
              ></button>
          </div>
      </div>
  );
}

ImagePopup.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentIndex: PropTypes.number.isRequired,
  setCurrentIndex: PropTypes.func.isRequired,
};