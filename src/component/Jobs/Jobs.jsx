import Logo from "@component/Header/Logo/Logo"
import Popup from "./Popup/Popup"
import ImagePopup from "./Popup/ImagePopup/ImagePopup"
import "@assets/blocks/Jobs.css"

function Jobs(props) {
    const { images, popup, onOpenPopup, onClosePopup } = props

    function handleCardClick(src) {
      onOpenPopup({ children: <ImagePopup src={src} /> });
    }

    return (
        <div className="jobs">
            <h2 className="jobs__title">
                Galeria de trabajos
                <Logo className="jobs__logo"/>
            </h2>
            <div className="jobs__gallery">
                {images.map((src, index) => (
                    <img
                    key={index}
                    className="jobs__gallery-item"
                    src={src}
                    alt=""
                    onClick={() => handleCardClick(src)}
                    />
                ))}
            </div>
            {popup && (
                <Popup onClose={onClosePopup}>
                {popup.children}
            </Popup>
        )}
        </div>
    )
}

export default Jobs;