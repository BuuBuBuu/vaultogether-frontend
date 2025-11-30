import React, { useState, useEffect } from 'react';
// Import the necessary MUI components
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';

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
    // TODO: Build the UI using Material UI components
    // Hints:
    // 1. Use <Container component="main" maxWidth="xs"> to center everything.
    // 2. Use <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}> for a nice card look.
    // 3. Use <Typography component="h1" variant="h5"> for the "Sign in" title.
    // 4. Use <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}> for the form element.

    // 5. Email Input: Use <TextField>
    //    - margin="normal", required, fullWidth, label="Email Address", autoFocus
    //    - value={email}, onChange={...}

    // 6. Password Input: Use <TextField>
    //    - margin="normal", required, fullWidth, label="Password", type="password"
    //    - value={password}, onChange={...}

    // 7. Submit Button: Use <Button>
    //    - type="submit", fullWidth, variant="contained", sx={{ mt: 3, mb: 2 }}
    //    - Text: "Sign In"

    // Close Box, Paper, Container
    <>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component={"h1"} variant='h5'>
            Sign in
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1}}>
            <TextField margin="normal" required fullWidth label="Email Address" autoFocus
            value={email} onChange={(e) => setEmail(e.target.value)}/>
            <TextField margin="normal" required fullWidth label="Password" type="password"
            value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  )
}
