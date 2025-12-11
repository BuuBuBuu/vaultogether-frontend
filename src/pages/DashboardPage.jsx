import React from 'react';
import { Container, Typography, Box, Button, AppBar, Toolbar, Grid, Card, CardContent, CardActionArea,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material'

import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  // useState for vaults
  const [vaults, setVaults] = useState([
    { id: 1, name: 'Personal', itemCount: 5 },
    { id: 2, name: 'Work', itemCount: 12 },
    { id: 3, name: 'Family', itemCount: 2},
  ])
  // Switch to control if the popup is open or closed
  const [open, setOpen] = useState(false);
  // Create variable to house newVaultName
  const [newVaultName, setNewVaultName] = useState('');
  // Call the useAuth custom hook so that we get the user data
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  // function to handle new vault creation
  const handleCreateVault = () => {
    // check whether the newVaultName contains anything
    if (!newVaultName.trim()) return;
    // create the newVault object for now here since we are testing the frontend
    const newVault = {
      id: Date.now(),
      name: newVaultName,
      itemCount: 0,
    };

    // Update State
    setVaults([...vaults, newVault]);

    // Cleanup (Close the dialog and clear the text box so that it's empty next time)
    setOpen(false);
    setNewVaultName('');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* The Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color='inherit'>
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
          <Grid container spacing={3}>
            {vaults.map((vault) => (
              <Grid item xs={12} sm={6} md={4} key={vault.id}>
                <Card>
                  <CardActionArea onClick={() => navigate("/vault/" + vault.id)}>
                    <CardContent>
                      <Typography variant="h5">{vault.name}</Typography>
                      <Typography color="text.secondary">
                        Contains {vault.itemCount} items
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4} key="add-new-vault">
              <Card>
                <CardActionArea onClick={() => setOpen(true)}>
                  <CardContent>
                    <Typography>+ New Vault</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
      </Container>
      {/* Create Vault Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Vault</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Vault Name"
            fullWidth
            variant="outlined"
            value={newVaultName}
            onChange={(e) => setNewVaultName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateVault}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
