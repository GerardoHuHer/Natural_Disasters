import React, { useState } from 'react';
import Deads from './Deads';
import './navbar.css'; // Archivo CSS para estilos

const Navbar = () => {
  const [activeNavItem, setActiveNavItem] = useState('home'); // Estado para mantener el elemento de la barra de navegación activo
  const [redirectToDeads, setRedirectToDeads] = useState(false); // Estado para manejar la redirección a Deads

  const handleNavItemClick = (item) => {
    setActiveNavItem(item); // Actualiza el estado con el elemento de la barra de navegación activo
    if (item === 'deads') {
      setRedirectToDeads(true); // Redirige a Deads si se hace clic en el botón correspondiente
    } else {
      setRedirectToDeads(false); // Restablece la redirección a Deads si se hace clic en otro botón
    }
  };

  if (redirectToDeads) {
    return <Deads />;
  }

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li className={activeNavItem === 'home' ? 'active' : ''}>
          <button onClick={() => handleNavItemClick('home')}>Home</button>
        </li>
        <li className={activeNavItem === 'about' ? 'active' : ''}>
          <button onClick={() => handleNavItemClick('about')}>About</button>
        </li>
        <li className={activeNavItem === 'contact' ? 'active' : ''}>
          <button onClick={() => handleNavItemClick('contact')}>Contact</button>
        </li>
        <li className={activeNavItem === 'deads' ? 'active' : ''}>
          <button onClick={() => handleNavItemClick('deads')}>Deads</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
