import React, { useState, useEffect } from 'react';

// Import the useAuth custom hook
import { useAuth } from '../../hooks/useAuth';


const LoginForm = () => {
  // Form state management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Take in the useAuth custom hook's functions
  const { login, user } = useAuth(); // Get Login functionality and user variable

  // Define a function `handleSubmit`
  // Accepts one parameter e for event.
  const handleSubmit = async (event) => {
    // Stop the page refresh
    event.preventDefault();
    // Call the login function from useAuth with the email and password state
    await login({ email, password });
    

  }

  return (

  )
}
