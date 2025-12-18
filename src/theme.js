// theme.js
// This file defines the custom Material-UI theme for the Vaultogether frontend application.
// It uses createTheme from '@mui/material/styles' to configure typography, color palette,
// and component-specific style overrides to ensure a consistent look and feel across the application.

import { createTheme } from '@mui/material/styles';

// Create a custom Material-UI theme.
// The createTheme function takes an options object where you can define
// various aspects of your design system.
const theme = createTheme({
  // --- Typography Settings ---
  // The typography section defines the global text styles for the application.
  typography: {
    // Set the default font family for all text elements.
    fontFamily: '"Fira Mono", monospace',
    // Apply a default color to all typography variants unless specifically overridden elsewhere.
    allVariants: {
      color: '#000000', // Default all text to black.
    },
  },

  // --- Color Palette Settings ---
  // The palette section defines the core colors used throughout the application.
  palette: {
    // Primary color is used for main actions, active states, and dominant elements.
    primary: {
      main: '#000000', // Set the primary color to black.
    },
    // Secondary color is used for secondary actions, accents, and less dominant elements.
    secondary: {
      main: '#d9d9d9', // Set the secondary color to a light gray.
    },
    // Background colors define the default colors for the app's surface and paper elements.
    background: {
      default: '#ffffff', // Default background color for the overall page.
      paper: '#ffffff',    // Background color for elevated surfaces like cards, modals, etc.
    },
  },

  // --- Component Style Overrides ---
  // The components section allows you to override the default styles of Material-UI components.
  // This is where you can apply custom styles globally to specific MUI components.
  components: {
    // --- MuiButton Overrides ---
    // Custom styles for all Material-UI Button components.
    MuiButton: {
      styleOverrides: {
        // Styles applied to the root element of the Button.
        root: {
          borderRadius: 0,       // Remove default round corners, making buttons sharp/square.
          textTransform: 'none', // Prevent text from being automatically capitalized.
          border: '1px solid transparent', // Add a transparent border by default.
        },
        // Styles applied to Button components with the 'contained' variant.
        contained: {
          boxShadow: 'none',     // Remove default shadow for contained buttons.
          '&:hover': {
            boxShadow: 'none',   // Ensure no shadow appears on hover for contained buttons.
          },
        },
      },
    },

    // --- MuiPaper Overrides ---
    // Custom styles for all Material-UI Paper components (used for cards, modals, etc.).
    MuiPaper: {
      styleOverrides: {
        // Styles applied to the root element of the Paper component.
        root: {
          borderRadius: 0,             // Remove default round corners.
          border: '2px solid #d9d9d9', // Add a prominent light gray border.
          boxShadow: 'none',           // Remove default shadow.
        },
      },
    },

    // --- MuiOutlinedInput Overrides ---
    // Custom styles for Material-UI OutlinedInput components (used in TextField with variant="outlined").
    MuiOutlinedInput: {
      styleOverrides: {
        // Styles applied to the root element of the OutlinedInput.
        root: {
          borderRadius: 0, // Remove default round corners for the input field.
          // Styles for the border (fieldset) of the outlined input.
          '& fieldset': {
            borderWidth: '2px',    // Make the border thicker.
            borderColor: '#d9d9d9', // Set default border color to light gray.
          },
          // Styles for the border when the input field is focused.
          '&.Mui-focused fieldset': {
            borderColor: '#000000', // Change border color to black when focused.
          },
        },
      },
    },
  },
});

export default theme;
