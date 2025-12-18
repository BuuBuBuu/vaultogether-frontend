import React, { useState } from "react";
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
  Alert,
} from "@mui/material";

import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyIcon from "@mui/icons-material/Key";
import { getValidationErrorMessage } from "../../utils/errorHandler";

const LoginForm = () => {
  // hold the current value of the email input field
  const [email, setEmail] = useState("");
  // hold value of the password input field
  const [password, setPassword] = useState("");
  // hold boolean state to toggle the visibility of the password in input field
  const [showPassword, setShowPassword] = useState(false);
  // destructure login function from custom hook
  const { login } = useAuth(); // Get Login functionality and user variable
  // Stores any error message that needs to be displayed to the user
  const [error, setError] = useState("");
  // Initialize useNavigate() function from React Router
  const navigate = useNavigate();

  // Define a function `handleSubmit`
  // Accepts one parameter e for event.
  const handleSubmit = async (event) => {
    // Stop the page refresh
    event.preventDefault();
    // clear error staet at the beginning of submission in case
    setError("");

    try {
      // Call the login function from useAuth with the email and password state
      // doing call login directly without try catch here because AuthContext
      // handles the try catch there
      await login({ email, password });
      // reach this line if the promise resolves navigating to dashboard
      navigate("/dashboard");
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
    // Just the header part of the login form
    // sx prop is used to apply custom styles
    // height 100vh makes the box take full viewport height
    // display flex makes it a flex container
    // alignItems center vertically centers the content
    // justifyContent center horizontally centers the content
    // bgcolor applies background color from theme
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400, px: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
            <Typography variant="h1" sx={{ fontSize: "40px", fontWeight: 400 }}>
              Vaultogether
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "13px" }}
          >
            Secure password management
          </Typography>
        </Box>

        {/*
          Error Alert that shows up only if there is an error message
          The Alert component from MUI is used to display the error
          severity="error" gives it a red color scheme
          sx prop is used to add margin bottom and remove border radius
        */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
            {error}
          </Alert>
        )}

        {/*
          Form that captures email and password inputs
          onSubmit event is handled by handleSubmit function
          later at the bottom we need to have a button to submit the form
          called sign in with the type submit
        */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography
                component="label"
                sx={{ display: "block", mb: 1, fontSize: "15px" }}
              >
                Email:
              </Typography>
              {/*
                TextField for email input
                fullWidth makes the input take full width of its container
                id is set to email for accessibility
                type is email to bring up email keyboard on mobile
                value is bound to email state
                onChange updates the email state when user types
                required makes the field mandatory
                autoFocus focuses this field on component mount
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
              />
            </Box>

            <Box>
              <Typography
                component="label"
                sx={{ display: "block", mb: 1, fontSize: "15px" }}
              >
                Password:
              </Typography>
              <TextField
                fullWidth
                id="password"
                type={showPassword ? "text" : "password"}
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

            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/*
                Sign In Button
                type="submit" makes this button submit the form
                fullWidth makes the button take full width of its container
                variant="contained" gives it a filled style
                color="secondary" applies the secondary color from the theme
                sx prop is used to apply custom styles like height and font size
                &:hover applies styles on hover state
              */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  height: 44,
                  fontSize: "15px",
                  bgcolor: "#d9d9d9",
                  "&:hover": { bgcolor: "#c5c5c5" },
                }}
              >
                Sign In
              </Button>

              {/*
                Register Button
                onClick navigates to the /register route when clicked
                variant="outlined" gives it an outlined style
                sx prop is used to apply custom styles like height, font size,
                border color, text color, and hover effects
              */}
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/register")}
                sx={{
                  height: 44,
                  fontSize: "15px",
                  borderColor: "#d9d9d9",
                  color: "text.primary",
                  "&:hover": { borderColor: "#000000", bgcolor: "transparent" },
                }}
              >
                Register
              </Button>
            </Box>
          </Box>
        </form>

        {/*
          Security Notice
          Paper component with outlined variant for border
          sx prop is used to apply margin top, padding, text alignment,
          and background color
          Typography component inside displays the notice text
          variant="caption" gives it a smaller font size
          color="text.secondary" applies secondary text color from theme
          sx prop is used to apply custom font size, line height, and display block
        */}
        <Paper
          variant="outlined"
          sx={{ mt: 4, p: 2, textAlign: "center", bgcolor: "transparent" }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "11px", lineHeight: 1.6, display: "block" }}
          >
            🔒 Secured with Basic Login only
            <br />
            🔐 Zero encryption at rest
            <br />
            🛡️ JWT-based stateless authentication (Nope)
          </Typography>
        </Paper>

        {/* Password Generator Link */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            startIcon={<KeyIcon />}
            onClick={() => navigate("/password-generator")}
            sx={{
              fontSize: "13px",
              color: "text.secondary",
              textDecoration: "underline",
              "&:hover": {
                textDecoration: "underline",
                color: "text.primary",
                bgcolor: "transparent",
              },
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
