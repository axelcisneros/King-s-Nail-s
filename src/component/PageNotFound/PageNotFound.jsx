import { Link } from "react-router-dom";
import KingsNails from '/KingsNails.png'
import "@assets/blocks/PageNotFound.css"

function PageNotFound() {
  return (
    <div className="not-found">
      <h3 className="not-found__title">
        404 - ¡Página no encontrada!
      </h3>
      <p className="not-found__text">
        ¡Uy! Aquí no hay nada... Lo sentimos. 🥺
      </p>
      <Link to="/" className="not-found__link">
      <img src={KingsNails} alt="King's Nail's" />
      Volver al inicio
      </Link>
    </div>
  );
}

export default PageNotFound;