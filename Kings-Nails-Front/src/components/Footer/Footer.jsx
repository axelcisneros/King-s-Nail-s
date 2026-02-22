import { Link } from "react-router-dom";
import WhatsApp from "/WhatsApp.svg";
import facebook from "/facebook.svg";
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <p>&copy; {currentYear} Kings Nails. Todos los derechos reservados.</p>
                <ul>
                    <li>
                        <Link
                            aria-label="Chat on WhatsApp"
                            to="https://wa.me/7717005244"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                alt="Chat on WhatsApp"
                                src={WhatsApp}
                            />
                        </Link>
                    </li>
                    <li >
                        <Link
                            to="mailto:kignsnails@outlook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src="data:image/png;base64,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"
                                alt="email"
                            />
                        </Link>
                    </li>
                    <li >
                        <Link
                            to="https://maps.app.goo.gl/r8ELbiW2Vi2FfRG98"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0FNQncW7JYLUFw7ci7XUUkyibbKSpxuPofQ&s"
                                alt="mapa"
                            />
                        </Link>
                    </li>
                    <li >
                        <Link
                            to="https://www.facebook.com/profile.php?id=100078210050883"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={facebook}
                                alt="facebook"
                            />
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
  );
};

export default Footer;