import { Link } from "react-router-dom";
import KingsNails from '/KingsNails.png'
import "@assets/blocks/Logo.css"

function Logo({className}) {
  return (
    <div className={className}>
      <Link to="/" className="logo__link">
        <img className="logo__image" src={KingsNails} alt="logo King's Nail's" />
      </Link>
    </div>
  );
}

export default Logo;