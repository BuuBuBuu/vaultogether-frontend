import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  TextField,
  IconButton,
  Chip,
  Stack,
  InputLabel,
  Input,
  FormControl,
} from "@mui/material";

import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getVaultsByUser, createVault, deleteVault } from "../services/api";

// Icons
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import KeyIcon from "@mui/icons-material/Key"; // Or VpnKey
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import CloseIcon from "@mui/icons-material/Close";

const DashboardPage = () => {
  // Initialize vaults to an empty array
  const [vaults, setVaults] = useState([]);
  // Switch to control if the popup is open or closed
  const [showCreateForm, setShowCreateForm] = useState(false);
  // Create variable to house newVaultName
  const [newVaultName, setNewVaultName] = useState("");
  // Create variable to house newVaultDesc
  const [newVaultDesc, setNewVaultDesc] = useState("");
  // Call the useAuth custom hook so that we get the user data
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // useEffect to call the getVaultsByUser endpoint
  useEffect(() => {
    const fetchData = async () => {
      if (user?.userId != null) {
        try {
          const data = await getVaultsByUser(user.userId);
          setVaults(data);
        } catch (error) {
          console.error("Failed to fetch vaults:", error);
        }
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // function to handle new vault creation
  const handleCreateVault = async (e) => {
    e.preventDefault();

    // check if the user is logged in
    if (!user || !user.userId) {
      console.error('User not logged in');
      navigate('/'); // Redirect to login
      return;
    }

    // check whether the newVaultName contains anything
    if (!newVaultName.trim()) return;

    // Call the async function in api called createVault(vaultData, userId)
    // vault data takes in String name, String encryptedStringKey for now use temp key
    const vaultData = {
      name: newVaultName,
      description: newVaultDesc,
      encryptedStringKey: "TEMP_KEY",
    };

    try {
      // Pass in the data to call the endpoint
      await createVault(vaultData, user.userId);
      // Get the new list of vaults from the back end and set the new vault state
      const updatedVaults = await getVaultsByUser(user.userId);
      setVaults(updatedVaults);
      // Cleanup (Close the dialog and clear the text box so that it's empty next time)
      setShowCreateForm(false);
      setNewVaultName("");
      setNewVaultDesc("");
    } catch (error) {
      console.error("Create failed", error);
    }
  };

  // handler function for existing vault deletion
  const handleDeleteVault = async (vaultId) => {
    if (!window.confirm("Are you sure you want to delete this vault?")) return;

    try {
      // Call the endpoint from the api
      await deleteVault(user.userId, vaultId);
      const updatedVaults = await getVaultsByUser(user.userId);
      setVaults(updatedVaults);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#ffffff" }}>
      {/* Brutalist Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: "2px solid #d9d9d9" }}
      >
        <Toolbar
          sx={{
            height: 80,
            maxWidth: "lg",
            mx: "auto",
            width: "100%",
            px: { xs: 2, md: 4 },
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 400,
                  fontFamily: "Fira Mono, monospace",
                  lineHeight: 1.2,
                }}
              >
                Vaultogether
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Fira Mono, monospace",
                  color: "text.secondary",
                }}
              >
                Your secure password vaults
              </Typography>
            </Box>
          </Box>

          <Button
            onClick={handleLogout}
            variant="outlined"
            startIcon={<ExitToAppIcon />}
            sx={{
              borderColor: "#d9d9d9",
              borderWidth: "2px",
              color: "text.primary",
              textTransform: "none",
              fontFamily: "Fira Mono, monospace",
              "&:hover": {
                borderColor: "#000000",
                bgcolor: "transparent",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        {/* Create Vault Section (Inline Form) */}
        <Box sx={{ mb: 6 }}>
          {!showCreateForm ? (
            <Button
              fullWidth
              variant="contained"
              onClick={() => setShowCreateForm(true)}
              startIcon={<AddIcon />}
              sx={{
                height: 50,
                bgcolor: "#d9d9d9",
                color: "black",
                boxShadow: "none",
                borderRadius: 0,
                border: "2px solid transparent",
                fontFamily: "Fira Mono, monospace",
                fontSize: "15px",
                "&:hover": {
                  bgcolor: "#c5c5c5",
                  borderColor: "black",
                  boxShadow: "none",
                },
              }}
            >
              Create New Vault
            </Button>
          ) : (
            <Box
              component="form"
              onSubmit={handleCreateVault}
              sx={{
                p: 4,
                border: "2px solid #d9d9d9",
                borderRadius: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "Fira Mono, monospace" }}
                >
                  New Vault
                </Typography>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  sx={{
                    fontFamily: "Fira Mono, monospace",
                    color: "text.secondary",
                    "&:hover": { color: "black", bgcolor: "transparent" },
                  }}
                >
                  Cancel
                </Button>
              </Box>

              <Stack spacing={3}>
                <Box>
                  <InputLabel
                    htmlFor="vault-name"
                    sx={{
                      fontFamily: "Fira Mono, monospace",
                      mb: 1,
                      color: "black",
                      fontSize: "14px",
                    }}
                  >
                    Vault Name:
                  </InputLabel>
                  <Input
                    id="vault-name"
                    value={newVaultName}
                    onChange={(e) => setNewVaultName(e.target.value)}
                    fullWidth
                    disableUnderline
                    autoFocus
                    placeholder="e.g., Personal, Work, Family"
                    sx={{
                      border: "2px solid #d9d9d9",
                      px: 2,
                      py: 1,
                      fontFamily: "Fira Mono, monospace",
                      "&.Mui-focused": {
                        border: "2px solid black",
                      },
                    }}
                  />
                </Box>

                {/* Description */}
                <Box>
                  <InputLabel
                    htmlFor="vault-desc"
                    sx={{
                      fontFamily: "Fira Mono, monospace",
                      mb: 1,
                      color: "black",
                      fontSize: "14px",
                    }}
                  >
                    Description (optional):
                  </InputLabel>
                  <Input
                    id="vault-desc"
                    value={newVaultDesc}
                    onChange={(e) => setNewVaultDesc(e.target.value)}
                    fullWidth
                    disableUnderline
                    placeholder="What's stored in this vault?"
                    sx={{
                      border: "2px solid #d9d9d9",
                      px: 2,
                      py: 1,
                      fontFamily: "Fira Mono, monospace",
                      "&.Mui-focused": {
                        border: "2px solid black",
                      },
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<SecurityIcon />}
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    borderRadius: 0,
                    height: 44,
                    fontFamily: "Fira Mono, monospace",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "#333",
                    },
                  }}
                >
                  Create Vault
                </Button>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Vaults Grid */}
        <Grid container spacing={3}>
          {vaults.length === 0 && !showCreateForm && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  p: 8,
                  textAlign: "center",
                  border: "2px dashed #d9d9d9",
                  color: "text.secondary",
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography sx={{ fontFamily: "Fira Mono, monospace", mb: 1 }}>
                  No vaults yet
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: "Fira Mono, monospace" }}
                >
                  Create your first vault to start storing passwords securely
                </Typography>
              </Box>
            </Grid>
          )}

          {vaults.map((vault) => (
            <Grid size={{ xs: 12, md: 6}} key={vault.vaultId}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "2px solid #d9d9d9",
                  borderRadius: 0,
                  boxShadow: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "black",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Fira Mono, monospace",
                            fontSize: "18px",
                          }}
                        >
                          {vault.name}
                        </Typography>
                        {/* Role Badge */}
                        <Box
                          sx={{
                            bgcolor: vault.role === "OWNER" ? 'black' : vault.role === 'EDITOR' ? '#1976d2' : '#757575',
                            color: "white",
                            px: 0.75,
                            py: 0.25,
                            fontSize: "10px",
                            fontFamily: "Fira Mono, monospace",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                          }}
                        >
                          {vault.role || "OWNER"}
                        </Box>
                      </Box>
                      {/* Description Placeholder if available in future */}
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "Fira Mono, monospace",
                          color: "text.secondary",
                          display: "block",
                          mb: 2,
                        }}
                      >
                        Created:{" "}
                        {new Date(vault.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    {/* Delete Button (Owner only action in reference) */}
                    {vault.role === 'OWNER' && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteVault(vault.vaultId)}
                        sx={{
                          color: "text.disabled",
                          "&:hover": { color: "error.main", bgcolor: "#fee" },
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  {/* Stats Row */}
                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <KeyIcon sx={{ fontSize: 14 }} />
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: "Fira Mono, monospace" }}
                      >
                        {vault.itemCount ?? 0} {vault.itemCount === 1 ? 'item': "items"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <GroupOutlinedIcon sx={{ fontSize: 14 }} />
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: "Fira Mono, monospace" }}
                      >
                        {vault.memberCount ?? 0} {vault.memberCount === 1 ? "member" : "members"}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <Box sx={{ p: 2, pt: 0, display: "flex", gap: 1 }}>
                  <Button
                    fullWidth
                    onClick={() => navigate("/vault/" + vault.vaultId)}
                    startIcon={<KeyIcon />}
                    sx={{
                      bgcolor: "#d9d9d9",
                      color: "black",
                      borderRadius: 0,
                      fontFamily: "Fira Mono, monospace",
                      textTransform: "none",
                      fontSize: "13px",
                      "&:hover": {
                        bgcolor: "black",
                        color: "white",
                      },
                    }}
                  >
                    Open Vault
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/vault/${vault.vaultId}/members`)}
                    sx={{
                      minWidth: "auto",
                      borderColor: "#d9d9d9",
                      borderWidth: "2px",
                      color: "black",
                      borderRadius: 0,
                      "&:hover": {
                        borderColor: "black",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    <SettingsOutlinedIcon fontSize="small" />
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Security Footer */}
        <Box
          sx={{ mt: 8, p: 3, border: "2px solid #d9d9d9", textAlign: "center" }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: "Fira Mono, monospace",
              color: "text.secondary",
              lineHeight: 1.8,
              display: "block",
            }}
          >
            🔒 All data encrypted with AES-GCM at rest
            <br />
            🔐 Zero-knowledge architecture
            <br />
            🛡️ Role-based access control for shared vaults
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;
