import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ems_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ems_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res?.data) {
            setUser((prev) => ({ ...prev, ...res.data }));
            localStorage.setItem('ems_user', JSON.stringify({ ...user, ...res.data }));
          }
        } catch (err) {
          console.warn('Auth verification error:', err);
        }
      }
      setLoading(false);
    };
    verifyAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const data = res.data;
    const userData = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      employeeId: data.employeeId,
    };
    setToken(data.token);
    setUser(userData);
    localStorage.setItem('ems_token', data.token);
    localStorage.setItem('ems_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    const data = res.data;
    const userData = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      employeeId: data.employeeId,
    };
    setToken(data.token);
    setUser(userData);
    localStorage.setItem('ems_token', data.token);
    localStorage.setItem('ems_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isUser = user?.role === 'ROLE_USER';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
