import { NavLink } from 'react-router-dom';
import "@assets/blocks/NavBar.css"

const customClassName = ({ isActive }) =>
    "nav__link" + " " + (isActive ? "nav__link_active" : "");

function NavBar() {
  return (
    <nav className="nav">
      <NavLink to="/" className={customClassName}>Inicio</NavLink>
      <NavLink to="/reviews" className={customClassName}>Reseñas</NavLink>
      <NavLink to="/prices" className={customClassName}>Costos</NavLink>
      <NavLink to="/about-us" className={customClassName}>Sobre nosotros</NavLink>
    </nav>
  )
}

export default NavBar;
