import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

// Pre-seeded demo user accounts for one-click hackathon switching
export const DEMO_USERS = {
  Citizen: {
    id: 'usr-citizen-1',
    name: 'Alex Rivera',
    email: 'citizen@resqflow.org',
    role: 'Citizen',
    phone: '+1 (555) 234-5678'
  },
  Responder: {
    id: 'usr-responder-1',
    name: 'Capt. Marcus Vance',
    email: 'responder@resqflow.org',
    role: 'Responder',
    responderType: 'Ambulance',
    organization: 'Metro EMS Unit 4',
    serviceArea: 'Downtown & Campus District'
  },
  Admin: {
    id: 'usr-admin-1',
    name: 'Commander Sarah Jenkins',
    email: 'admin@resqflow.org',
    role: 'Admin',
    organization: 'City Emergency Operations Center'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('resqflow_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.Citizen;
  });
  const [token, setToken] = useState(() => localStorage.getItem('resqflow_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('resqflow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('resqflow_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('resqflow_token', token);
    } else {
      localStorage.removeItem('resqflow_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      return res.data;
    } catch (err) {
      throw err.response?.data?.error || 'Login failed';
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(userData);
      setUser(res.data.user);
      setToken(res.data.token);
      return res.data;
    } catch (err) {
      throw err.response?.data?.error || 'Registration failed';
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('resqflow_user');
    localStorage.removeItem('resqflow_token');
  };

  // Instant demo switcher for hackathon judges
  const switchDemoRole = (roleName) => {
    const demoAcc = DEMO_USERS[roleName] || DEMO_USERS.Citizen;
    setUser(demoAcc);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      switchDemoRole,
      isCitizen: user?.role === 'Citizen',
      isResponder: user?.role === 'Responder',
      isAdmin: user?.role === 'Admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
