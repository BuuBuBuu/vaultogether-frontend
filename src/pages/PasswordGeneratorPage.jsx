import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Slider,
  Checkbox,
  FormControlLabel,
  LinearProgress,
} from '@mui/material';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const PasswordGeneratorPage = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Character sets
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };

  // Generate password
  const generatePassword = () => {
    let charset = '';
    let guaranteedChars = '';

    // Build charset and ensure at least one character from each selected type
    if (options.uppercase) {
      charset += charSets.uppercase;
      guaranteedChars += charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)];
    }
    if (options.lowercase) {
      charset += charSets.lowercase;
      guaranteedChars += charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)];
    }
    if (options.numbers) {
      charset += charSets.numbers;
      guaranteedChars += charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)];
    }
    if (options.symbols) {
      charset += charSets.symbols;
      guaranteedChars += charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)];
    }

    if (charset === '') {
      setPassword('');
      return;
    }

    let newPassword = guaranteedChars;
    const remainingLength = length - guaranteedChars.length;

    for (let i = 0; i < remainingLength; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(newPassword);
    setCopied(false);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Toggle option
  const toggleOption = (key) => {
    const newOptions = { ...options, [key]: !options[key] };
    // Ensure at least one option is selected
    if (Object.values(newOptions).some(v => v)) {
      setOptions(newOptions);
    }
  };

  // Calculate password strength
  const calculateStrength = () => {
    if (!password) return { label: '', color: '', width: 0 };

    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (options.uppercase && options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;

    if (score <= 2) return { label: 'Weak', color: '#ef4444', width: 33 };
    if (score <= 4) return { label: 'Medium', color: '#f59e0b', width: 66 };
    return { label: 'Strong', color: '#22c55e', width: 100 };
  };

  // Generate initial password
  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const strength = calculateStrength();
  const atLeastOneSelected = Object.values(options).some(v => v);

  // Back button handler with location state so that form doesnt close
  const handleBack = () => {
    const returnTo = location.state?.returnTo || '/dashboard';
    const returnState = {
      generatedPassword: password,
      formData: location.state?.formData,
      editingId: location.state?.editingId,
    };
    navigate(returnTo, { state: returnState });
  }

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
            onClick={handleBack}
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
                Password Generator
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'Fira Mono, monospace',
                  color: 'text.secondary',
                }}
              >
                Create cryptographically secure passwords
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ mt: 8, mb: 6 }}>
        {/* Generated Password Display */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                fontFamily: 'Fira Mono, monospace',
                fontSize: '18px',
                p: 2,
                pr: 14,
                border: '2px solid #d9d9d9',
                borderRadius: 0,
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                wordBreak: 'break-all',
                bgcolor: '#fafafa',
              }}
            >
              {password || 'Select options to generate'}
            </Box>
            <Box
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                gap: 1,
              }}
            >
              <IconButton
                onClick={copyToClipboard}
                disabled={!password}
                sx={{
                  bgcolor: '#d9d9d9',
                  borderRadius: 0,
                  width: 44,
                  height: 44,
                  '&:hover': { bgcolor: '#c5c5c5' },
                  '&:disabled': { bgcolor: '#e5e5e5' },
                }}
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckIcon sx={{ fontSize: 20 }} />
                ) : (
                  <ContentCopyIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
              <IconButton
                onClick={generatePassword}
                disabled={!atLeastOneSelected}
                sx={{
                  bgcolor: '#d9d9d9',
                  borderRadius: 0,
                  width: 44,
                  height: 44,
                  '&:hover': { bgcolor: '#c5c5c5' },
                  '&:disabled': { bgcolor: '#e5e5e5' },
                }}
                title="Generate new password"
              >
                <RefreshIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Password Strength Indicator */}
          {password && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Fira Mono, monospace',
                    fontSize: '11px',
                    color: 'text.secondary',
                  }}
                >
                  Strength:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Fira Mono, monospace',
                    fontSize: '11px',
                    color: strength.color,
                  }}
                >
                  {strength.label}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={strength.width}
                sx={{
                  height: 8,
                  borderRadius: 0,
                  bgcolor: '#e5e5e5',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: strength.color,
                    borderRadius: 0,
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Password Length */}
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Fira Mono, monospace',
                fontSize: '15px',
              }}
            >
              Length:
            </Typography>
            <Box
              sx={{
                fontFamily: 'Fira Mono, monospace',
                fontSize: '15px',
                bgcolor: '#d9d9d9',
                px: 2,
                py: 0.5,
                borderRadius: '4px',
              }}
            >
              {length}
            </Box>
          </Box>
          <Slider
            value={length}
            onChange={(e, value) => setLength(value)}
            min={4}
            max={64}
            step={1}
            sx={{
              color: 'black',
              '& .MuiSlider-thumb': {
                width: 20,
                height: 20,
                borderRadius: 0,
              },
              '& .MuiSlider-track': {
                border: 'none',
                height: 4,
              },
              '& .MuiSlider-rail': {
                opacity: 0.3,
                height: 4,
              },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Fira Mono, monospace',
                fontSize: '11px',
                color: 'text.secondary',
              }}
            >
              4
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Fira Mono, monospace',
                fontSize: '11px',
                color: 'text.secondary',
              }}
            >
              64
            </Typography>
          </Box>
        </Box>

        {/* Character Options */}
        <Box
          sx={{
            mb: 6,
            p: 3,
            border: '2px solid #d9d9d9',
            borderRadius: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Fira Mono, monospace',
              fontSize: '15px',
              mb: 2,
            }}
          >
            Character Types:
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.uppercase}
                  onChange={() => toggleOption('uppercase')}
                  sx={{
                    color: 'black',
                    '&.Mui-checked': { color: 'black' },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: 'Fira Mono, monospace',
                    fontSize: '14px',
                  }}
                >
                  Uppercase (A-Z)
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.lowercase}
                  onChange={() => toggleOption('lowercase')}
                  sx={{
                    color: 'black',
                    '&.Mui-checked': { color: 'black' },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: 'Fira Mono, monospace',
                    fontSize: '14px',
                  }}
                >
                  Lowercase (a-z)
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.numbers}
                  onChange={() => toggleOption('numbers')}
                  sx={{
                    color: 'black',
                    '&.Mui-checked': { color: 'black' },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: 'Fira Mono, monospace',
                    fontSize: '14px',
                  }}
                >
                  Numbers (0-9)
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.symbols}
                  onChange={() => toggleOption('symbols')}
                  sx={{
                    color: 'black',
                    '&.Mui-checked': { color: 'black' },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: 'Fira Mono, monospace',
                    fontSize: '14px',
                  }}
                >
                  Symbols (!@#$%^&*...)
                </Typography>
              }
            />
          </Stack>
        </Box>

        {/* Info Box */}
        <Box
          sx={{
            p: 3,
            border: '2px solid #d9d9d9',
            borderRadius: 0,
            textAlign: 'center',
          }}
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
            💡 Recommended: 16+ characters with all types enabled
            <br />
            🔐 Passwords are generated locally and never sent to servers
            <br />
            🎲 Uses cryptographically secure randomization
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PasswordGeneratorPage;
