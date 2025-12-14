import React, { createContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../services/api';

// For context we need 3 distinct pieces
// Piece 1: This is the context itself (When just create it does not hold data yet)
const AuthContext = createContext({});

// Piece 3: This is the Wrapper Component (AuthProvider) which is just a regular
// React component that we write to hold the state (user, login logics) and renders
// the AuthContext.Provider to share that state.
const AuthProvider = ({ children }) => {
  // Initializze user from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Create async function to login
  const login = async (credentials) => {
    // Await the call to the communications layer (loginUser from api.js)
    const userData = await loginUser(credentials);
    // Upon success, use the state setter to save the user data
    setUser(userData);
    // Return success status or the user data
    return userData;
  };

  // Create async function to register
  // register function takes in an object with keys email and password
  // use object parameter destructuring
  const register = async ({ email, password }) => {
    // structure the provided object using object parameter destructuring
    const userData = { email, password };
    // Await the call to the communications layer (loginUser from api.js)
    // Pass in the provided email and password
    const result = await registerUser(userData);
    // Upon success, return the result
    return result;
    // I decide to return to the login page after successful registration
    // Do not automatically log the user in
    // if registration is unsuccessful then we keep them on the registration page
  };

  // Logout function to clear user state
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    // Piece 2: The Provider component which is a special React component
    // that comes attached to the Context that we created. It takes a value prop
    // and broadcasts it to everything inside it {children}
    <AuthContext.Provider value={{ user, login, register, logout }}>
      { children }
    </AuthContext.Provider>
  )
}

export { AuthContext };
export default AuthProvider;
