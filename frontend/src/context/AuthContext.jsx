import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as loginApi } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('healthmap_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('healthmap_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((res) => {
        setUser(res.data.data);
        localStorage.setItem('healthmap_user', JSON.stringify(res.data.data));
      })
      .catch(() => {
        localStorage.removeItem('healthmap_token');
        localStorage.removeItem('healthmap_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const { token, user: u } = res.data.data;
    localStorage.setItem('healthmap_token', token);
    localStorage.setItem('healthmap_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('healthmap_token');
    localStorage.removeItem('healthmap_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

