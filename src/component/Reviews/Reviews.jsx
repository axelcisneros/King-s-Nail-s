import Logo from "../Header/Logo/Logo";
import "@assets/blocks/Reviews.css"

function Reviews() {
    return(
        <div className="reviews">
            <h2 className="reviews__title">Conoce la opinion de nuestros clientes</h2>
            <iframe
            className="reviews__frame"
            title="Reviews"
            src="https://widget.taggbox.com/2152510"
            />
            <Logo />
        </div>
    )
}

export default Reviews;