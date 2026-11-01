import React, { createContext, useContext } from 'react';

// Versione standalone: il sito è statico e pubblico, non c'è autenticazione.
// Il contesto resta per compatibilità con i componenti esistenti.
const value = {
  user: null,
  isAuthenticated: false,
  isLoadingAuth: false,
  isLoadingPublicSettings: false,
  authError: null,
  appPublicSettings: null,
  authChecked: true,
  logout: () => {},
  navigateToLogin: () => {},
  checkUserAuth: async () => {},
  checkAppState: async () => {},
};

const AuthContext = createContext(value);

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);

export const useAuth = () => useContext(AuthContext);
