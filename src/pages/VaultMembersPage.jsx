// =============== Imports ===============
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  InputLabel,
  Input,
  Select,
  MenuItem,
  FormControl,
  Card,
  Alert,
} from '@mui/material';

import useAuth from '../hooks/useAuth';
import {
  getVaultById,
  getVaultMembers,
  addVaultMember,
  updateVaultMemberRole,
  deleteVaultMember,
} from '../services/api';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ShieldIcon from '@mui/icons-material/Shield';
import CrownIcon from '@mui/icons-material/WorkspacePremium';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getValidationErrorMessage } from '../utils/errorHandler';

// =============== Vault Members Page ===============
const VaultMembersPage = () => {
  // =============== States ===============
  const [members, setMembers] = useState([]);
  const [vaultName, setVaultName] = useState("Vault");
  const [userRole, setUserRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    email: "",
    role: "VIEWER",
  });
  const [memberError, setMemberError] = useState("");
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isOwner = userRole === "OWNER";

  // =============== useEffect ===============
  useEffect(() => {
    const fetchData = async () => {
      // Guard clause for if there is no user or no userId
      // Also if there is no id (vault) then exit
      if (user?.userId != null && id) {
        try {
          // Fetch vault details call api method
          const vaultData = await getVaultById(user.userId, id);
          setVaultName(vaultData.name);
          setUserRole(vaultData.role);

          // Fetch members
          const membersData = await getVaultMembers(user.userId, id);
          setMembers(membersData || []);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };
    fetchData();
  }, [user, id]);

  // =============== Handlers ===============
  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!user || !user.userId) {
      console.error("User not logged in");
      navigate("/");
      return;
    }

    if (!newMember.email.trim()) {
      return;
    }

    try {
      const memberData = {
        email: newMember.email,
        role: newMember.role,
        encryptedVaultKey: "TEMP_KEY",
      };

      await addVaultMember(user.userId, id, memberData);
      const updatedMembers = await getVaultMembers(user.userId, id);
      setMembers(updatedMembers || []);

      // Reset form
      setNewMember({ email: "", role: "VIEWER" });
      setShowAddForm(false);
    } catch (error) {
      const validationMsg = getValidationErrorMessage(error);
      if (validationMsg) {
        setMemberError(validationMsg);
      } else {
        console.error("Failed to add member:", error);
        setMemberError(error.response?.data || "Failed to add member");
      }
    }
  };

  const handleRoleUpdate = async (email, newRole) => {
    try {
      await updateVaultMemberRole(user.userId, id, email, newRole);
      const updatedMembers = await getVaultMembers(user.userId, id);
      setMembers(updatedMembers || []);
    } catch (error) {
      const validationMsg = getValidationErrorMessage(error);
      if (validationMsg) {
        setMemberError(validationMsg);
      } else {
        console.error("Failed to add member:", error);
        setMemberError(error.response?.data || "Failed to add member");
      }
    }
  };

  const handleRemoveMember = async (email, memberEmail) => {
    if (!window.confirm(`Remove ${memberEmail} from this vault?`)) return;

    try {
      await deleteVaultMember(user.userId, id, email);
      const updatedMembers = await getVaultMembers(user.userId, id);
      setMembers(updatedMembers || []);
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert(error.response?.data || "Failed to remove member");
    }
  };

  // =============== Helper function ===============
  const getRoleIcon = (role) => {
    switch (role) {
      case "OWNER":
        return <CrownIcon sx={{ fontSize: 16 }} />;
      case "EDITOR":
        return <EditIcon sx={{ fontSize: 16 }} />;
      case "VIEWER":
        return <VisibilityIcon sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "OWNER":
        return "black";
      case "EDITOR":
        return "#1976d2";
      case "VIEWER":
        return "#757575";
      default:
        return "black";
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case "OWNER":
        return "Full control, can manage members";
      case "EDITOR":
        return "Can add, edit, and delete items";
      case "VIEWER":
        return "Can only view items";
      default:
        return "";
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#ffffff' }}>
      {/* Brutalist Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: '2px solid #d9d9d9' }}
      >
        <Toolbar
          sx={{
            height: 80,
            maxWidth: 'lg',
            mx: 'auto',
            width: '100%',
            px: { xs: 2, md: 4 },
          }}
        >
          <IconButton
            onClick={() => navigate('/dashboard')}
            sx={{
              mr: 2,
              color: 'text.primary',
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <LockOutlinedIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 400,
                  fontFamily: 'Fira Mono, monospace',
                  lineHeight: 1.2,
                }}
              >
                Vault Members
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'Fira Mono, monospace',
                  color: 'text.secondary',
                }}
              >
                {vaultName} | {members.length} {members.length === 1 ? 'member' : 'members'}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        {/* Role Legend */}
        <Box
          sx={{
            mb: 6,
            p: 3,
            border: '2px solid #d9d9d9',
            borderRadius: 0,
            bgcolor: '#fafafa',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Fira Mono, monospace',
              fontSize: '13px',
              mb: 2,
            }}
          >
            Access Levels:
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
              <Box sx={{ mt: 0.5, color: 'black' }}>
                {getRoleIcon('OWNER')}
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'Fira Mono, monospace',
                    fontSize: '12px',
                    textTransform: 'capitalize',
                  }}
                >
                  Owner <span style={{ fontSize: '10px', color: '#757575' }}>(Auto-assigned)</span>
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Fira Mono, monospace',
                    fontSize: '10px',
                    color: 'text.secondary',
                  }}
                >
                  Vault creator, full control, cannot be changed
                </Typography>
              </Box>
            </Box>
            {['EDITOR', 'VIEWER'].map((role) => (
              <Box key={role} sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                <Box sx={{ mt: 0.5, color: getRoleColor(role) }}>
                  {getRoleIcon(role)}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'Fira Mono, monospace',
                      fontSize: '12px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {role.toLowerCase()}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Fira Mono, monospace',
                      fontSize: '10px',
                      color: 'text.secondary',
                    }}
                  >
                    {getRoleDescription(role)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Add Member Button/Form */}
        {isOwner && (
          <Box sx={{ mb: 6 }}>
            {!showAddForm ? (
              <Button
                fullWidth
                variant="contained"
                onClick={() => setShowAddForm(true)}
                startIcon={<PersonAddIcon />}
                sx={{
                  height: 50,
                  bgcolor: '#d9d9d9',
                  color: 'black',
                  boxShadow: 'none',
                  border: '2px solid transparent',
                  fontFamily: 'Fira Mono, monospace',
                  fontSize: '15px',
                  '&:hover': {
                    bgcolor: '#c5c5c5',
                    borderColor: 'black',
                    boxShadow: 'none',
                  },
                }}
              >
                Add Member
              </Button>
            ) : (
              <Box
                component="form"
                onSubmit={handleAddMember}
                sx={{
                  p: 4,
                  border: '2px solid #d9d9d9',
                  borderRadius: 0,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: 'Fira Mono, monospace' }}
                  >
                    Add Member
                  </Typography>
                  <Button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewMember({ email: '', role: 'VIEWER' });
                      setMemberError('');
                    }}
                    sx={{
                      fontFamily: 'Fira Mono, monospace',
                      color: 'text.secondary',
                      '&:hover': { color: 'black', bgcolor: 'transparent' },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>

                {memberError && (
                  <Alert
                    severity="error"
                    onClose={() => setMemberError('')}
                    sx={{
                      mb: 3,
                      borderRadius: 0,
                      border: '2px solid #d32f2f',
                      fontFamily: 'Fira Mono, monospace'
                    }}
                  >
                    {memberError}
                  </Alert>
                )}

                <Stack spacing={3}>
                  <Box>
                    <InputLabel
                      htmlFor="member-email"
                      sx={{
                        fontFamily: 'Fira Mono, monospace',
                        mb: 1,
                        color: 'black',
                        fontSize: '14px',
                      }}
                    >
                      Email:
                    </InputLabel>
                    <Input
                      id="member-email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      fullWidth
                      disableUnderline
                      required
                      autoFocus
                      placeholder='email@example.com'
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
                  </Box>

                  <Box>
                    <InputLabel
                      sx={{
                        fontFamily: 'Fira Mono, monospace',
                        mb: 1,
                        color: 'black',
                        fontSize: '14px',
                      }}
                    >
                      Access Level:
                    </InputLabel>
                    <Stack direction="row" spacing={2}>
                      {['VIEWER', 'EDITOR'].map((role) => (
                        <Button
                          key={role}
                          type="button"
                          onClick={() => setNewMember({ ...newMember, role })}
                          sx={{
                            flex: 1,
                            p: 2,
                            border: '2px solid',
                            borderColor: newMember.role === role ? 'black' : '#d9d9d9',
                            bgcolor: newMember.role === role ? 'black' : 'transparent',
                            color: newMember.role === role ? 'white' : 'black',
                            borderRadius: 0,
                            fontFamily: 'Fira Mono, monospace',
                            fontSize: '13px',
                            textTransform: 'capitalize',
                            flexDirection: 'column',
                            gap: 0.5,
                            '&:hover': {
                              borderColor: 'black',
                              bgcolor: newMember.role === role ? '#333' : 'transparent',
                            },
                          }}
                        >
                          {getRoleIcon(role)}
                          {role.toLowerCase()}
                        </Button>
                      ))}
                    </Stack>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    startIcon={<ShieldIcon />}
                    sx={{
                      bgcolor: 'black',
                      color: 'white',
                      borderRadius: 0,
                      height: 44,
                      fontFamily: 'Fira Mono, monospace',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#333',
                      },
                    }}
                  >
                    Add Member
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        )}

        {/* Members List */}
        {members.length === 0 ? (
          <Box
            sx={{
              p: 8,
              textAlign: 'center',
              border: '2px dashed #d9d9d9',
              color: 'text.secondary',
            }}
          >
            <PersonAddIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography sx={{ fontFamily: 'Fira Mono, monospace', mb: 1 }}>
              No members yet
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontFamily: 'Fira Mono, monospace' }}
            >
              {isOwner ? 'Add members to share this vault' : 'Only vault owners can add members'}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {members.map((member) => {
              const isMemberOwner = member.role === 'OWNER';
              const canModify = isOwner && !isMemberOwner;

              return (
                <Card
                  key={member.userId}
                  sx={{
                    p: 3,
                    border: '2px solid #d9d9d9',
                    borderRadius: 0,
                    boxShadow: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'black',
                      '& .member-actions': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {/* Member Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: '#f5f5f5',
                          borderRadius: '4px',
                          color: getRoleColor(member.role),
                        }}
                      >
                        {getRoleIcon(member.role)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <Typography
                            sx={{
                              fontFamily: 'Fira Mono, monospace',
                              fontSize: '15px',
                            }}
                          >
                            {member.email}
                          </Typography>
                          <Box
                            sx={{
                              px: 1,
                              py: 0.25,
                              borderRadius: '4px',
                              bgcolor: member.role === 'OWNER' ? 'black' : member.role === 'EDITOR' ? '#e3f2fd' : '#d9d9d9',
                              color: member.role === 'OWNER' ? 'white' : member.role === 'EDITOR' ? '#1976d2' : 'black',
                              fontFamily: 'Fira Mono, monospace',
                              fontSize: '10px',
                              textTransform: 'uppercase',
                            }}
                          >
                            {member.role}
                          </Box>
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: 'Fira Mono, monospace',
                            fontSize: '10px',
                            color: 'text.secondary',
                          }}
                        >
                          Added: {new Date(member.addedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box
                      className="member-actions"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        opacity: canModify ? 0 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {canModify && (
                        <>
                          <FormControl size="small">
                            <Select
                              value={member.role}
                              onChange={(e) => handleRoleUpdate(member.email, e.target.value)}
                              sx={{
                                fontFamily: 'Fira Mono, monospace',
                                fontSize: '12px',
                                border: '2px solid #d9d9d9',
                                borderRadius: 0,
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '&:hover': {
                                  borderColor: 'black',
                                },
                              }}
                            >
                              <MenuItem value="VIEWER" sx={{ fontFamily: 'Fira Mono, monospace' }}>Viewer</MenuItem>
                              <MenuItem value="EDITOR" sx={{ fontFamily: 'Fira Mono, monospace' }}>Editor</MenuItem>
                            </Select>
                          </FormControl>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveMember(member.email, member.email)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'error.main', bgcolor: '#fee' },
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                      {isMemberOwner && !canModify && (
                        <Typography
                          sx={{
                            px: 2,
                            py: 1,
                            fontFamily: 'Fira Mono, monospace',
                            fontSize: '11px',
                            color: 'text.secondary',
                          }}
                        >
                          Cannot modify owner
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Stack>
        )}

        {/* Security Footer */}
        <Box
          sx={{ mt: 8, p: 3, border: '2px solid #d9d9d9', textAlign: 'center' }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'Fira Mono, monospace',
              color: 'text.secondary',
              lineHeight: 1.8,
              display: 'block',
              fontSize: '11px',
            }}
          >
            🔐 Role-based access control with two assignable roles
            <br />
            👑 Vault creator is the permanent owner with full control
            <br />
            🛡️ Only owners can add members and manage permissions
          </Typography>
        </Box>
      </Container>
    </Box>

  );
};

export default VaultMembersPage;
