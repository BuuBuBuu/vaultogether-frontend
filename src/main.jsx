import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import AuthProvider from './store/AuthContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
)

// The AuthProvider is the global context that holds the user, login, register, logout
// Prop drilling we setup all the states props inside AuthContext.jsx which
// implements the AuthProvider component which encapsulates all of the
// info in the value={{user, login, register, logout}} so that means that
// all of the {children} will access this
