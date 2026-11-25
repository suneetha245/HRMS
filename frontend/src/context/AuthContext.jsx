import { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('hr_token'));

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('hr_token', data.token);
    setToken(data.token);
  };
  const logout = () => {
    localStorage.removeItem('hr_token');
    setToken(null);
  };

  return <AuthContext.Provider value={{ token, isAuth: !!token, login, logout }}>{children}</AuthContext.Provider>;
}
