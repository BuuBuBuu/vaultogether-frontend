import React, { useState, useEffect } from 'react';
// Import the necessary MUI components
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';

// Import the useAuth custom hook
import useAuth from '../../hooks/useAuth';

// Import the useNavigate hook
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import { getValidationErrorMessage } from '../../utils/errorHandler';

const LoginForm = () => {
  // Form state management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Take in the useAuth custom hook's functions
  const { login, user } = useAuth(); // Get Login functionality and user variable
  // useState to store the error
  const [error, setError] = useState('');
  // Initialize useNavigate()
  const navigate = useNavigate();

  // Define a function `handleSubmit`
  // Accepts one parameter e for event.
  const handleSubmit = async (event) => {
    // Stop the page refresh
    event.preventDefault();
    setError('');

    try {
      // Call the login function from useAuth with the email and password state
      // doing call login directly without try catch here because AuthContext
      // handles the try catch there
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      // Check for validation errors
      const validationMsg = getValidationErrorMessage(error);
      if (validationMsg) {
        setError(validationMsg);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400, px: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
            <Typography variant="h1" sx={{ fontSize: '40px', fontWeight: 400 }}>
              Vaultogether
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
            Secure password management
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            <Box>
              <Typography component="label" sx={{ display: 'block', mb: 1, fontSize: '15px' }}>
                Email:
              </Typography>
              <TextField
                fullWidth
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                autoFocus
              />
            </Box>

            <Box>
              <Typography component="label" sx={{ display: 'block', mb: 1, fontSize: '15px' }}>
                Password:
              </Typography>
              <TextField
                fullWidth
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  height: 44,
                  fontSize: '15px',
                  bgcolor: '#d9d9d9',
                  '&:hover': { bgcolor: '#c5c5c5' }
                }}
              >
                Sign In
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/register")}
                sx={{
                  height: 44,
                  fontSize: '15px',
                  borderColor: '#d9d9d9',
                  color: 'text.primary',
                  '&:hover': { borderColor: '#000000', bgcolor: 'transparent' }
                }}
              >
                Register
              </Button>
            </Box>

          </Box>
        </form>

        {/* Security Notice */}
        <Paper
          variant="outlined"
          sx={{ mt: 4, p: 2, textAlign: 'center', bgcolor: 'transparent' }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', lineHeight: 1.6, display: 'block' }}>
            🔒 Secured with Basic Login only<br/>
            🔐 Zero encryption at rest<br/>
            🛡️ JWT-based stateless authentication (Nope)
          </Typography>
        </Paper>

        {/* Password Generator Link */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
           <Button
            startIcon={<KeyIcon />}
            onClick={() => navigate('/password-generator')}
            sx={{
              fontSize: '13px',
              color: 'text.secondary',
              textDecoration: 'underline',
              '&:hover': { textDecoration: 'underline', color: 'text.primary', bgcolor: 'transparent' }
            }}
          >
            Generate secure password
          </Button>
        </Box>

      </Box>
    </Box>
  );
};

export default LoginForm;
