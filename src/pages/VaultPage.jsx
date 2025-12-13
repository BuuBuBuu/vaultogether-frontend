// =============== Imports ===============
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  InputAdornment,
  Card,
  Stack,
  InputLabel,
  Input,
} from "@mui/material";

import useAuth from "../hooks/useAuth";
import {
  getItemByVault,
  createVaultItem,
  deleteVaultItem,
  updateVaultItem,
  getVaultById,
} from "../services/api";

// =============== Import Icons ===============
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyIcon from "@mui/icons-material/Key";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SecurityIcon from "@mui/icons-material/Security";

// =============== VaultPage ===============
const VaultPage = () => {
  // =============== Set States ===============
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    username: "",
    password: "",
    notes: "",
  });
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [vaultName, setVaultName] = useState("Vault");
  const [vaultDescription, setVaultDescription] = useState("");
  const [userRole, setUserRole] = useState(null);
  // useParams to get the VAULTTT IDDD from the URL forgot this
  const { id } = useParams();
  // calling useAuth
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Define permission check where only OWNER and EDITOR can modify items
  const canEdit = userRole === 'OWNER' || userRole === 'EDITOR';

  // =============== useEffect to fetch items on MOUNT ===============
  useEffect(() => {
    const fetchVaultData = async () => {
      if (user?.userId != null && id) {
        try {
          // Fetch vault details
          const vaultData = await getVaultById(user.userId, id);
          setVaultName(vaultData.name);
          setVaultDescription(vaultData.description || "");
          setUserRole(vaultData.role);

          // Fetch items data
          const data = await getItemByVault(user.userId, id);
          setItems(data || []);
        } catch (error) {
          console.error("Failed to fetch vault data:", error);
          setVaultName("Vault"); // Just add a fallback here
        }
      }
    };
    fetchVaultData();
  }, [user, id]);

  useEffect(() => {
    // Check if returning from password generator
    if (location.state?.generatedPassword) {
      setShowForm(true);
      if (location.state?.formData) {
        setFormData({
          ...location.state.formData,
          password: location.state.generatedPassword,
        });
      } else {
        setFormData(prev => ({
          ...prev,
          password: location.state.generatedPassword,
        }));
      }
      if (location.state?.editingId) {
        setEditingId(location.state.editingId);
      }
      // Clear the location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state])

  // ============== Form Handlers ===============
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.userId) {
      console.error("User not logged in");
      navigate("/");
      return;
    }

    if (
      !formData.title.trim() ||
      !formData.username.trim() ||
      !formData.password.trim()
    ) {
      return;
    }

    try {
      if (editingId) {
        await updateVaultItem(user.userId, id, editingId, formData);
        const updatedItems = await getItemByVault(user.userId, id);
        setItems(updatedItems || []);
      } else {
        await createVaultItem(user.userId, id, formData);
        const updatedItems = await getItemByVault(user.userId, id);
        setItems(updatedItems || []);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", type: "", username: "", password: "", notes: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || "",
      type: item.type || "",
      username: item.username || "",
      password: item.password || "",
      notes: item.notes || "",
    });
    setEditingId(item.itemId);
    setShowForm(true);
  };

  // handler function for existing vault item deletion
  const handleDelete = async (itemId) => {
    // add in the display confirmation dialog during delete
    // understanding is window.confirm() returns true
    // so if user click cancel the it will return false
    // so if we negate the false it will return true
    // and so we cancel the delete action using return
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteVaultItem(user.userId, id, itemId);
      const updatedVaultItems = await getItemByVault(user.userId, id);
      setItems(updatedVaultItems);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const togglePasswordVisibility = (itemId) => {
    const newSet = new Set(visiblePasswords); // Copy current set
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    setVisiblePasswords(newSet); // Update
  };

  const copyToClipboard = async (text, itemId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
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
          <IconButton
            onClick={() => navigate("/dashboard")}
            sx={{
              mr: 2,
              color: "text.primary",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}
          >
            <LockOutlinedIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 400,
                  fontFamily: "Fira Mono, monospace",
                  lineHeight: 1.2,
                }}
              >
                {vaultName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Fira Mono, monospace",
                  color: "text.secondary",
                }}
              >
                {items.length} {items.length === 1 ? "item" : "items"}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        {/* Add Item Button/Form */}
        {canEdit && (
          <Box sx={{ mb: 6 }}>
            {!showForm ? (
              <Button
                fullWidth
                variant="contained"
                onClick={() => setShowForm(true)}
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
                Add Password Item
              </Button>
            ) : (
              <Box
                component="form"
                onSubmit={handleSubmit}
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
                    {editingId ? "Edit Item" : "New Password Item"}
                  </Typography>
                  <Button
                    onClick={resetForm}
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
                      htmlFor="item-title"
                      sx={{
                        fontFamily: "Fira Mono, monospace",
                        mb: 1,
                        color: "black",
                        fontSize: "14px",
                      }}
                    >
                      Title / Service:
                    </InputLabel>
                    <Input
                      id="item-title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      fullWidth
                      disableUnderline
                      required
                      autoFocus
                      placeholder="e.g., GitHub, Netflix, Gmail"
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

                  <Box>
                    <InputLabel
                      htmlFor="item-type"
                      sx={{
                        fontFamily: "Fira Mono, monospace",
                        mb: 1,
                        color: "black",
                        fontSize: "14px",
                      }}
                    >
                      Type (optional):
                    </InputLabel>
                    <Input
                      id="item-type"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      fullWidth
                      disableUnderline
                      placeholder="e.g., Login, API Key, SSH"
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

                  <Box>
                    <InputLabel
                      htmlFor="item-username"
                      sx={{
                        fontFamily: "Fira Mono, monospace",
                        mb: 1,
                        color: "black",
                        fontSize: "14px",
                      }}
                    >
                      Username / Email:
                    </InputLabel>
                    <Input
                      id="item-username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      fullWidth
                      disableUnderline
                      required
                      placeholder="username or email"
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

                  <Box>
                    <InputLabel
                      htmlFor="item-password"
                      sx={{
                        fontFamily: 'Fira Mono, monospace',
                        mb: 1,
                        color: 'black',
                        fontSize: '14px',
                      }}
                    >
                      Password:
                    </InputLabel>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Input
                        id="item-password"
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        fullWidth
                        disableUnderline
                        required
                        placeholder="password"
                        sx={{
                          border: '2px solid #d9d9d9',
                          px: 2,
                          py: 1,
                          fontFamily: 'Fira Mono, monospace',
                          '&.Mui-focused': {
                            border: '2px solid black',
                          },
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => navigate('/password-generator', {
                          state: {
                            returnTo: `/vault/${id}`,
                            formOpen: true,
                            formData: formData,
                            editingId: editingId
                          }
                        })}
                        sx={{
                          minWidth: 'auto',
                          height: 40,
                          px: 2,
                          bgcolor: '#d9d9d9',
                          color: 'black',
                          borderRadius: 0,
                          fontFamily: 'Fira Mono, monospace',
                          fontSize: '12px',
                          '&:hover': {
                            bgcolor: '#c5c5c5',
                          },
                        }}
                      >
                        <KeyIcon sx={{ fontSize: 18 }} />
                      </Button>
                    </Box>
                  </Box>

                  <Box>
                    <InputLabel
                      htmlFor="item-notes"
                      sx={{
                        fontFamily: "Fira Mono, monospace",
                        mb: 1,
                        color: "black",
                        fontSize: "14px",
                      }}
                    >
                      Notes (optional):
                    </InputLabel>
                    <Input
                      id="item-notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      fullWidth
                      multiline
                      rows={3}
                      disableUnderline
                      placeholder="Additional notes or recovery information"
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
                    {editingId ? "Update Item" : "Save Item"}
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        )}



        {/* Items List */}
        {items.length === 0 ? (
          <Box
            sx={{
              p: 8,
              textAlign: "center",
              border: "2px dashed #d9d9d9",
              color: "text.secondary",
            }}
          >
            <KeyIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography sx={{ fontFamily: "Fira Mono, monospace", mb: 1 }}>
              No password items yet
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontFamily: "Fira Mono, monospace" }}
            >
              {canEdit ? 'Add your first password to this vault' : 'This vault is empty'}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {items.map((item) => (
              <Card
                key={item.itemId}
                sx={{
                  p: 3,
                  border: "2px solid #d9d9d9",
                  borderRadius: 0,
                  boxShadow: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "black",
                    "& .item-actions": {
                      opacity: 1,
                    },
                  },
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Fira Mono, monospace",
                        fontSize: "16px",
                        mb: 0.5,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "Fira Mono, monospace",
                        color: "text.secondary",
                        fontSize: "12px",
                      }}
                    >
                      {item.username}
                    </Typography>
                  </Box>

                  {/* Action Buttons - Only show for OWNER and EDITOR */}
                  {canEdit && (
                    <Box
                      className="item-actions"
                      sx={{
                        display: "flex",
                        gap: 1,
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(item)}
                        sx={{
                          color: "text.secondary",
                          "&:hover": {
                            color: "primary.main",
                            bgcolor: "#f5f5f5",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(item.itemId)}
                        sx={{
                          color: "text.secondary",
                          "&:hover": { color: "error.main", bgcolor: "#fee" },
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Password Row */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      fontFamily: "Fira Mono, monospace",
                      fontSize: "14px",
                      bgcolor: "#fafafa",
                      px: 2,
                      py: 1.5,
                      border: "1px solid #e5e5e5",
                      borderRadius: "4px",
                    }}
                  >
                    {visiblePasswords.has(item.itemId)
                      ? item.password
                      : "••••••••••••"}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => togglePasswordVisibility(item.itemId)}
                    sx={{
                      color: "text.secondary",
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    {visiblePasswords.has(item.itemId) ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(item.password, item.itemId)}
                    sx={{
                      color:
                        copiedId === item.itemId
                          ? "success.main"
                          : "text.secondary",
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    {copiedId === item.itemId ? (
                      <CheckIcon fontSize="small" />
                    ) : (
                      <ContentCopyIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>

                {/* Notes */}
                {item.notes && (
                  <Box
                    sx={{
                      pt: 2,
                      borderTop: "1px solid #e5e5e5",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "Fira Mono, monospace",
                        fontSize: "11px",
                        color: "text.secondary",
                      }}
                    >
                      {item.notes}
                    </Typography>
                  </Box>
                )}

                {/* Metadata */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    pt: 1,
                    fontFamily: "Fira Mono, monospace",
                    fontSize: "10px",
                    color: "text.secondary",
                  }}
                >
                  {item.createdAt && (
                    <span>
                      Created: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  {item.updatedAt && item.updatedAt !== item.createdAt && (
                    <span>
                      Updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                  {item.type && <span>Type: {item.type}</span>}
                </Box>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default VaultPage;
