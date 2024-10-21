// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext'; // Importa o contexto

export const useAuth = () => {
  return useContext(AuthContext);
};
