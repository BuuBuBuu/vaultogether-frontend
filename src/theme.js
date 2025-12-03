import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Fira Mono", monospace',
    allVariants: {
      color: '#000000', // Default text to black
    },
  },
  palette: {
    primary: {
      main: '#000000', // Black primary actions
    },
    secondary: {
      main: '#d9d9d9', // Gray secondary actions
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  components: {
    // Override Button to be sharp and bold
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // No round corners
          textTransform: 'none', // Keep natural case
          border: '1px solid transparent',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    // Override Paper (Cards) to have a border
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid #d9d9d9',
          boxShadow: 'none',
        },
      },
    },
    // Override Inputs
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '& fieldset': {
            borderWidth: '2px',
            borderColor: '#d9d9d9',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#000000', // Black border on focus
          },
        },
      },
    },
  },
});

export default theme;
