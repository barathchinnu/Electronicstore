import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('electrostore_user') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (user?.token) {
        try {
          const { data } = await getMe();
          setUser((prev) => ({ ...prev, ...data.data }));
        } catch {
          setUser(null);
          localStorage.removeItem('electrostore_user');
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('electrostore_user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('electrostore_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
