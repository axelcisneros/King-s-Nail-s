import Logo from "../Header/Logo/Logo"
import "@assets/blocks/Jobs.css"

function Jobs({images}) {
    return (
        <div className="jobs">
            <h2 className="jobs__title">
                Galeria de trabajos
                <Logo className="jobs__logo"/>
            </h2>
            <div className="jobs__gallery">
                {images.map((src, index) => (
                    <img key={index} className="jobs__gallery-item" src={src} alt="" />
                ))}
            </div>
        </div>
    )
}

export default Jobs;