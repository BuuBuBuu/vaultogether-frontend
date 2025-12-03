import { useState, useEffect } from "react";
import { registerUser, loginUser } from "../services/api";

function useAuth() {
  const [user, setUser] = useState(null);

  // Create async function to login
  const login = async (credentials) => {
    try {
      // Await the call to the communications layer (loginUser from api.js)
      const userData = await loginUser(credentials);
      // Upon success, use the state setter to save the user data
      setUser(userData);
      // Future: Handle token storage/session
      // Return success status or the user data
      return userData;
    } catch (error) {
      return error;
    }
  };

  // Create async function to register
  // register function takes in an object with keys email and password
  // use object parameter destructuring
  const register = async ({ email, password }) => {
    // structure the provided object using object parameter destructuring
    const userData = { email, password };
    try {
      // Await the call to the communications layer (loginUser from api.js)
      // Pass in the provided email and password
      const result = await registerUser(userData);
      // Upon success, return the result
      return result;
      // I decide to return to the login page after successful registration
      // Do not automatically log the user in
      // if registration is unsuccessful then we keep them on the registration page
    } catch (error) {
      return error;
    }
  };

  // Logout function to clear user state
  const logout = () => {
    setUser(null);
  };

  return {
    user,
    login,
    register,
    logout,
  };
}

export default useAuth;
