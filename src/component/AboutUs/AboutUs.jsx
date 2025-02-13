import { Outlet, Link } from "react-router-dom";
import Logo from "../Header/Logo/Logo"
import "@assets/blocks/AboutUs.css"

function AboutUs() {
  return (
    <div className="about-us">
      <h2 className="about-us__title">
        Somos King's Nail's desde junio del 2020 consintiendo a nuestros clientes con los mejores servicios de manicura y pedicura.
        <Logo className="about-us__logo"/>
      </h2>
      <ul className="about-us__erratas">
        <li className="about-us__list">
          *Sujeto a cambio, previa cotización
        </li>
        <li className="about-us__list">
          **El curso no incluye kit de inicio
        </li>
        <li className="about-us__list">
          ***No se cuenta con envios, preguntar al cotizar
        </li>
      </ul>
      <ul className="about-us__links">
        <li className="about-us__link">
          <Link to="hours">Horarios</Link>
        </li>
        <li className="about-us__link">
          <Link to="contact">Contacto y Citas</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default AboutUs;