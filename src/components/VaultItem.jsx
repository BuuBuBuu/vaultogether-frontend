import React from 'react';
import { Typography, Button, Card, Snackbar, Alert} from '@mui/material'

import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const VaultItem = ( {item} ) => {

  // set state for password display
  const [showPassword, setShowPassword] = useState(false);

  // set state for showing snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // function for handling copy
  const handleCopy = () => {
    navigator.clipboard.writeText(item.password);
    setOpenSnackbar(true);
  }

  return (
    <Card>
      <Typography>{item.title}</Typography>
      <Typography>{item.username}</Typography>
      <Typography>{showPassword? item.password : "••••••••"}</Typography>
      <Button onClick={() => setShowPassword(!showPassword)}>Show/Hide Password</Button>
      <Button onClick={() => handleCopy()}>Copy Password</Button>
      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success">Password Copied!</Alert>
      </Snackbar>
    </Card>
  );

}

export default VaultItem;
