import Logo from "./Logo/Logo.jsx";
import NavBar from "./NavBar/NavBar.jsx";
import "@assets/blocks/Header.css"

function Header() {
  return (
    <header className="header">
      <Logo />
      <h1 className="header__title">King's Nail's</h1>
      <NavBar />
    </header>
  );
}

export default Header;