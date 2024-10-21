import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import '/src/styles/Navigation.css'; // Estilos personalizados

const Navigation = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar a abertura do menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Alterna o estado do menu
  };

  return (
    <nav className="navigation">
      <div className="nav-logo"><img src="logo2.png" alt="Logo" /></div> {/* Adicione sua logo aqui */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰ {/* Ícone do menu hamburguer */}
      </button>
      <ul className={`nav-list ${isMenuOpen ? 'open' : ''}`}> {/* Adiciona a classe 'open' se o menu estiver aberto */}
        <li className="nav-item">
          <Link className="nav-link" to="/products">Produtos</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/planilha-controle">Planilha Controle</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/gallery">Galeria</Link> {/* Link para a galeria */}
        </li>
        <li className="nav-item">
          <button className="logout-button" onClick={onLogout}>Voltar ao Login</button>
        </li>
      </ul>
    </nav>
  );
};

// Definindo validação de props
Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Navigation;

