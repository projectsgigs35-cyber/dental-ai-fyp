import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then((res) => setDoctor(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, doctorData) => {
    localStorage.setItem('token', token);
    setDoctor(doctorData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setDoctor(null);
  };

  const updateDoctor = (data) => setDoctor((prev) => ({ ...prev, ...data }));

  return (
    <AuthContext.Provider value={{ doctor, login, logout, loading, updateDoctor }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);