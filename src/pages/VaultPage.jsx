import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Button, AppBar, Toolbar, Grid, Card, CardContent, CardActionArea,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material'
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useState } from 'react';
import VaultItem from '../components/VaultItem';

const VaultPage = () => {
  // useState for dummy items
  const [items, setItems] = useState([
    { id: 1, title: "First", username: "User1", password: "secret-password-1" },
    { id: 2, title: "Second", username: "User2", password: "secret-password-2" },
    { id: 3, title: "Third", username: "User3", password: "secret-password-3" },
  ])
  // Switch to control if the popup is open or closed
  const [open, setOpen] = useState(false);
  // Create variable to house newVaultItemName
  const [newVaultItemTitle, setNewVaultItemTitle] = useState('');
  // Create variable to house newVaultItemUsername
  const [newVaultItemUsername, setNewVaultItemUsername] = useState('');
  // Create variable to house newVaultItemPassword
  const [newVaultItemPassword, setNewVaultItemPassword] = useState('');
  // useParams to get the id from the URL
  const { id } = useParams();
  // calling useAuth
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  // function to handle new vault item creation
  const handleCreateVaultItem = () => {
    // check whether the newVaultItemName contains anything
    if (!newVaultItemTitle.trim()) return;
    // create the newVaultItem object for now here since we are testing frontend
    const newVaultItem = {
      id: Date.now(),
      title: newVaultItemTitle,
      username: newVaultItemUsername,
    }
    // Update state
    setItems([...items, newVaultItem]);
    // Cleanup (Close the dialog and clear the text box so that it's empty next time)
    setOpen(false);
    setNewVaultItemTitle('');
    setNewVaultItemUsername('');
    setNewVaultItemPassword('');
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
          <Button color="inherit" onClick={() => navigate("/dashboard")}>Back</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* The Content Area */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Vault {id} Items</Typography>
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <VaultItem item={item} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} key="add-new-vault-item">
            <Card>
              <CardActionArea onClick={() => setOpen(true)}>
                <CardContent>
                  <Typography>+ New Item</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {/* Create Vault Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Vault Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Vault Item Title"
            fullWidth
            variant="outlined"
            value={newVaultItemTitle}
            onChange={(e) => setNewVaultItemTitle(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Vault Item Username"
            fullWidth
            variant="outlined"
            value={newVaultItemUsername}
            onChange={(e) => setNewVaultItemUsername(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Vault Item Password"
            fullWidth
            variant="outlined"
            value={newVaultItemPassword}
            onChange={(e) => setNewVaultItemPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateVaultItem}>Create</Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
}

export default VaultPage;
