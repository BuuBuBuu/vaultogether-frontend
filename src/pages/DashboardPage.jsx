import React from 'react';
// Import MUI components (Container, Typography, Box, Button)
import { Container, Typography, Box, Button, AppBar, Toolbar, Grid, Card, CardContent } from '@mui/material'

// Import useAuth to get the user's name (optional for now)
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  // Call the useAuth custom hook so that we get the user data
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }
  // return (
  //   // TODO: Create a simple Dashboard UI
  //   // 1. Use <Container> as the main wrapper
  //   // 2. Add a <Typography variant="h3"> that says "Welcome to your Vault"
  //   // 3. (Optional) Display the user's email if available
  //   // 4. Add a placeholder <Box> where the list of passwords will go later

  //   <>
  //     <Container>
  //       <Typography variant="h3">
  //         Welcome to your Vault {user?.email}
  //       </Typography>
  //       <Box>

  //       </Box>
  //     </Container>
  //   </>
  // );


  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* The Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Vaultogether
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* The Content Area */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>My Vaults</Typography>
        {/* We will add the Grid here next */}
      </Container>
    </Box>
  );
};

export default DashboardPage;
