import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Importa a biblioteca
import '/src/styles/Login.css'; // Estilos personalizados



const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState(''); // Altera para username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Adiciona a classe ao body ao montar o componente
    document.body.classList.add('login-background');

    // Remove a classe ao desmontar o componente
    return () => {
      document.body.classList.remove('login-background');
    };
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    // Obtém as credenciais do .env
    const validUsername = import.meta.env.VITE_VALID_USERNAME;
    const validPassword = import.meta.env.VITE_VALID_PASSWORD;

    // Lógica de autenticação
    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true); // Atualiza o estado de autenticação
      navigate('/products');
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    
    <div className="login-container">
        <img src="/subliarte_sistema/logo.png" alt="Logo" className="login-logo" />

      
      <form onSubmit={handleSubmit}>
      <h1>Login</h1>
        <div>
          <label>Usuário:</label>
          <input
            type="text" // Altera para texto
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Atualiza para username
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

// Adiciona a validação de PropTypes
Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;
