// src/components/AuthContext.jsx
import { createContext,  useState } from 'react';
import PropTypes from 'prop-types'; // Importa a biblioteca prop-types

// Criação do contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = (props) => {
  const { children } = props; // Desestrutura children das props
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Validação de prop para o AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Define que children é um node e é obrigatório
};

