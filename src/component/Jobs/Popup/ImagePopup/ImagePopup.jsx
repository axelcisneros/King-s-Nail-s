export default function ImagePopup(props) {
    const { src } = props;
    return (
        <div className="popup__images">
            <div className="popup__content-image">
              <img className="popup__image" src={src} alt="" />
            </div>
        </div>
    );
}