import React, { useState, useEffect } from 'react';
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import { getValidationErrorMessage } from '../../utils/errorHandler';

const RegisterForm = () => {
  // TODO: Create state for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const {register} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect for the return from password generator
  useEffect(() => {
    // Check return from password generator
    if (location.state?.generatedPassword) {
      setPassword(location.state?.generatedPassword);
      setConfirmPassword(location.state?.generatedPassword);
      if (location.state?.formData) {
        setEmail(location.state?.formData);
      }
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Call register logic from AuthContext
      await register({ email, password });
      // Navigate to login page after successful registration
      navigate('/');
    } catch (error) {
      const validationMsg = getValidationErrorMessage(error);
      if (validationMsg) {
        // set the message to error usestate
        setError(validationMsg);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    /*
      use <Box> as outermost component
        set box height to 100% vertically fill entire screen
        flex, align to center
        align to middle horizontally justify center
    */
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      {/*
        This box is the direct parent of all of the form's content,
        makes sure that the width is not too wide horizontally
      */}
      <Box sx={{ width: '100%', maxWidth: 400, px: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            {/* Lock Icon from MUI */}
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
            <Typography variant="h1" sx={{ fontSize: '40px', fontWeight: 400 }}>
              Vaultogether
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
            Create your secure vault
          </Typography>
        </Box>

        {/*
          Error Alert provides visual feedback for registration errors
          renders only if error state variable is truthy
        */}
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
              {/*
                fullWidth makes the text field span the entire width of the parent box
                value and onChange used together as controlled component pattern
                  onChange function is called each time the user types, updating state
                  which in turn causes the component to re-render and display the new val

              */}
              <TextField
                fullWidth
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                autoFocus
                slotProps={{
                  htmlInput: {
                    maxLength: 255
                  }
                }}
              />
            </Box>

            <Box>
              <Typography component="label" sx={{ display: 'block', mb: 1, fontSize: '15px' }}>
                Password:
              </Typography>
              {/*
                type={showPassword ? 'text' : 'password'} is a dynamic visibility
                  if showPassword is true show text otherwise password masked
                value and onChange used together as controlled component pattern
                  onChange function is called each time the user types, updating state
                  which in turn causes the component to re-render and display the new val
                slotProps allows customizing the internal parts.
                  input adds the IconButton at the end of the textfield
                    this icon changes also based on the showPassword boolean to diff icons
                htmlinput targets the raw underlying <input> element and applies
                standard html attributes for basic length validation in browser.
              */}
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
                  htmlInput: {
                    maxLength: 128,
                    minLength: 8,
                  }
                }}
              />
            </Box>

            <Box>
              <Typography component="label" sx={{ display: 'block', mb: 1, fontSize: '15px' }}>
                Confirm Password:
              </Typography>
              <TextField
                fullWidth
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                variant="outlined"
                slotProps={{
                  htmlInput: {
                    maxLength: 128,
                    minLength: 8,
                  }
                }}
              />
            </Box>

            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/*
                type="submit" critical. tells browser that clicking on this button
                should trigger the onSubmit event on the parent <form> element which
                then calls the handlesubmit function


              */}
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
                Register
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  height: 44,
                  fontSize: '15px',
                  borderColor: '#d9d9d9',
                  color: 'text.primary',
                  '&:hover': { borderColor: '#000000', bgcolor: 'transparent' }
                }}
              >
                Back to Login
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
            🔒 Secured with Argon2id password hashing<br/>
            🔐 AES-GCM encryption at rest<br/>
            🛡️ JWT-based stateless authentication
          </Typography>
        </Paper>

        {/*
          Password Generator Link
          this link passes state information to the password generator page so that when
          coming back here we can use the data to auto fill back the form. so if like
          user fills in email halfway and press the generate passoword when they come
          back here it will auto fill for the user and as if they never left.
          There are only 2 links to password generator one is here and another in the
          vault item creation form / page. here to return here, we pass in the return to
          as /register and also the form data here is just the email. no need editingid
          because item isnt edited so no need to pass back the editing id.
        */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
           <Button
            startIcon={<KeyIcon />}
            onClick={() => navigate('/password-generator', {
              state: {
                returnTo: "/register",
                formData : email,
                editingId: null,
              }
            })}
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

export default RegisterForm;
