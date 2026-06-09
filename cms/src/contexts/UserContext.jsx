import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const user = useSelector((state) => state.login);

  return (
    <UserContext.Provider value={user?.data || null}>
      {children}
    </UserContext.Provider>
  );
}; 