import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import PlanilhaControle from './components/PlanilhaControle';
import Products from './components/Products';
import Navigation from './components/Navigation';
import Login from './components/Login'; // Componente de login
import Gallery from './components/Gallery'; // Componente da galeria


import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para autenticação

  const handleLogin = () => {
    setIsAuthenticated(true); // Define o estado como autenticado
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Define o estado como não autenticado
  };

  return (
    
    <Router>
      
      {!isAuthenticated ? (
        <Login setIsAuthenticated={handleLogin} /> 
      ) : (
        <>
      
          <Navigation onLogout={handleLogout} /> {/* Navegação */}
          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/planilha-controle" element={<PlanilhaControle />} />
            <Route path="/gallery" element={<Gallery />} /> {/* Rota para a galeria */}
          </Routes>
          
        </>
        
      )}
      
    </Router>
  );
}

export default App;





// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { useState } from 'react';
// import PlanilhaControle from './components/PlanilhaControle';
// import Products from './components/Products';
// import Navigation from './components/Navigation';
// import Login from './components/Login'; // Importe o componente de login
// import Gallery from './components/Gallery'; // Importe o componente Gallery
// import './App.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Renomeie isLoggedIn para isAuthenticated

//   const handleLogin = () => {
//     setIsAuthenticated(true); // Atualiza o estado para indicar que o usuário está autenticado
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false); // Atualiza o estado para indicar que o usuário não está autenticado
//   };

//   return (
//     <Router>
//       {!isAuthenticated ? (
//         <Login setIsAuthenticated={handleLogin} /> 
//       ) : (
//         <>
//           <Navigation onLogout={handleLogout} /> {/* Adicione a navegação aqui */}
//           <Routes>
//             <Route path="/products" element={<Products />} />
//             <Route path="/planilha-controle" element={<PlanilhaControle />} />
//             <Route path="/gallery" element={<Gallery />} /> {/* Adicione a rota para a galeria */}
//           </Routes>
//         </>
//       )}
//     </Router>
//   );
// }

// export default App;







// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import PlanilhaControle from './components/PlanilhaControle';
// import Products from './components/Products';
// import Navigation from './components/Navigation'; // Importe o componente de navegação
// import './App.css'

// function App() {
//   return (
//     <>
//       <Router>
//         <Navigation /> {/* Adicione a navegação aqui */}
//         <Routes>
//           {/* <Route path="/" element={<Home />} /> */}
//           <Route path="/products" element={<Products />} />
//           <Route path="/planilha-controle" element={<PlanilhaControle />} />
//         </Routes>
//       </Router>
//     </>
//   );
// }

// export default App;

