import React, { useState } from 'react';
// TODO: Import MUI components (Box, Button, TextField, Typography, Container, Paper)
// import { ... } from '@mui/material';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';

// TODO: Import hooks (useAuth, useNavigate)
// import useAuth from ...
import useAuth from "../../hooks/useAuth";
// import { useNavigate } from ...
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  // TODO: Create state for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // TODO: Get the register function from useAuth
  const {register} = useAuth();
  // TODO: Get the navigate function
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // TODO: Call register with email and password
    // await register({ email, password });
    await register({ email, password });
    // TODO: Navigate to the login page ('/') after successful registration
    navigate('/');
  };

  return (
    // TODO: Build the UI
    // Hint: It is 90% similar to LoginForm!
    // 1. Container, Paper, Typography ("Register")
    // 2. Form Box
    // 3. Email TextField
    // 4. Password TextField
    // 5. Submit Button ("Sign Up")

    // Challenge: Add a Button or Link below to switch to Login if they already have an account
    <>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component={"h1"} variant='h5'>
            Register
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth label="Email Address" autoFocus
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField margin="normal" required fullWidth label="Password" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Button fullWidth variant="contained" sx={{ mt: 1, mb: 2 }} onClick={() => navigate("/")}>
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Container>

    </>
  );
};

export default RegisterForm;
