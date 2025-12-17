import React, { useState, useEffect, useCallback } from 'react';
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
import AppBarHeader from '../components/AppBarHeader';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


// Define the charSets constant object outside of the component otherwise going to
// have linting errors...this is used in the useCallback function and its a true
// const that is only initialized once
// Character sets
const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

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

  // Generate password
  // we useCallback() hook here that lets us cache a function definition between re-renders
  // so ultimately this function only ever changes if the dependencies change
  // initially we put the useEffect below's dependencies as [options, length]
  // but in that case there was linting errors
  // So create generatePassword this way. and then pass generatePassword into the
  // useEffect's dependencies.
  const generatePassword = useCallback(() => {
    // create one variable to hold total charset AND
    // create another variable to hold guaranteedchars just to ensure that albeit
    // unlikely that we encounter a scenario that the charset password does not
    // include one of the guaranteed chars but since its random there is a possibility
    // thus we force minimum of 1 guaranteedchar per chosen set of charsets.
    let charset = '';
    let guaranteedChars = '';

    // Build charset and ensure at least one character from each selected type
    if (options.uppercase) {
      // Add whole charset into the possible selection
      charset += charSets.uppercase;
      // Add ONE char from the charset to the string already.
      // We get a random number from 0 inclusive to 1.0 exclusive and then multiply
      // with the length of the charset. Then we round DOWN with floor.
      // So now we confirm to get a random value range 0 to charset.length in this case 0 - 25
      // Then we get the value in the charSet at that particular position
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

    // Scenario that all charsets not chosen return nothing.
    if (charset === '') {
      setPassword('');
      return;
    }

    // set the new password with the guranteedchars first
    let newPassword = guaranteedChars;
    // based on the user's set length use state, we calculate how much more chars to add
    const remainingLength = length - guaranteedChars.length;

    // for the numbers of chars left to add we loop from 0 to that num
    // we use same strat as the guaranteed chars to add to the new password string
    for (let i = 0; i < remainingLength; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    // newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    // Shuffle the pasword using Fisher-Yates algo
    const passwordArray = newPassword.split('');

    for (let i = passwordArray.length - 1; i > 0; i--) {
      // Pick a random index from 0 to i (inclusive)
      const randomIndex = Math.floor(Math.random() * (i + 1));

      // Swap passwordArray[i] with passwordArray[randomIndex]
      const temp = passwordArray[i];
      passwordArray[i] = passwordArray[randomIndex];
      passwordArray[randomIndex] = temp;
    }

    // Join back the shuffled passwordArray and replace newPassword with the shuffled
    newPassword = passwordArray.join('');
    setPassword(newPassword);
    setCopied(false);
  }, [options, length]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Toggle option
  // This function is called when user clicks the checkbox below in the generator
  // toggle the charsets
  const toggleOption = (key) => {
    // First we assign the newOptions with the current options object value using spread operator
    // Then we REASSIGN the value inside the current object.
    // use brackets [] to signify that we want the key as the value not to create a
    // new key var pair with "key" as key.
    // Then we just take the opposite of the current key's boolean value and assign
    const newOptions = { ...options, [key]: !options[key] };
    // Ensure at least one option is selected
    // More concise way used below in atLeastOneSelected
    const atLeastOneChecked = newOptions.uppercase === true ||
                              newOptions.lowercase === true ||
                              newOptions.numbers === true ||
                              newOptions.symbols === true;
    // Only update if at least one checkbox remains checked
    if (atLeastOneChecked) {
      setOptions(newOptions);
    }
  };

  // Calculate password strength simple one that count to 5
  // +1 if length more than 12
  // +1 if length more than 16
  // +1 if uppercase and lowercase checked (better to have mixed case)
  // +1 if numbers included
  // +1 if symbols included
  // based on the score, we set the label, color and width
  // which gets translated into the <LinearProgress> bar below the password box
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

  // Immediately use the function above to calculate strength and store into the object
  // keys label (probably use above LinearProgress bar)
  // color (use to color the linearprogress bar)
  // width out of 100 in order to change the size of the bar
  const strength = calculateStrength();

  // Generate initial password
  // Check the generatePassword function's comments above for more info.
  // had to refactor dependencies of the useEffect so that there are no linting errors
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Object.values creates array out of the values of the object.
  // Meaning in options there are 4 key v pairs it will have 4 value array resulting 4 booleans
  // .some() then checks and stops early if one of the callback's return value is TRUTHY
  // what is TRUTHY?? means boolean true OR number like -5, 5 is truthy while 0 is falsy OR string "Hello" truthy "" falsy.
  // v => v means like (v) => { return v; }
  // in this case since boolean if v is true return true and the .some stops and assigns true to atLeastOneSelected
  // else assign to false
  const atLeastOneSelected = Object.values(options).some(v => v);

  // Back button handler with location state so that form doesnt close
  // this one mainly for the vaultpage when creating item and also the
  // register page.
  // to navigate here we pass in the location states useLocation states
  // dictionary type value
  // pass in and then we can pass back to the component we navigate to which so far
  // is just go back to the previous page because returnTo assign to go back
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
    // The main Box component is the single parent element returned.
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#ffffff' }}>
    {/* Use Box which is the most basic MUI layout component that renders a <div> by default */}
    {/* Use it to create a container that fills the entire screen heigth and has a white background */}
      {/* Use our own appbarheader component here */}
      <AppBarHeader
        title="Password Generator"
        subtitle="Create cryptographically secure passwords"
        onBack={handleBack}
      >
      </AppBarHeader>

      {/* Main Content */}
      {/*
        This component centers the main content horizontally.
        maxWidth - xs sm md lg (default) xl false string
          Determine the max-width of the container.
          The container width grows with the size of the screen.
          Set to false to disable maxWidth.
      */}
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
            {/* Copy and Refresh Buttons */}
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
              {/*
                Icon buttons for copy
                When clicked, it will run the copyToClipboard function
                the function copies the current password state to clipboard
                it sets the copied state to true which toggles the icon change
                timeout 2000ms that auto changes copied state back to false
                which resets the icon
              */}
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
                {/* The block which changes the icon based on copied state t/f */}
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

          {/*
            Password Strength Indicator <LinearProgress>
            This component shows the weak medium strong progress bar.
          */}
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
              {/*
                use variant="determinate" so that the progress bar show a specific
                  value instead of just a loading animation.
                value={strength.width} we se the value of the determinate bar to the
                  value of the strength calculated with the function before the return section
                use MuiLinearProgress-bar to target the inner part of the component
                  to change its color based on the password's strength
              */}
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

        {/*
          Password Length Control <Slider> let user select password len.

        */}
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
          {/*
            Use slider's standard props to update
            value={length} takes the current length state
            onChange={handleChange} takes an EVENT and new value and then sets the new val with setLength
            use min and max to define range of slider
          */}
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

        {/*
          Character Type Options <Checkbox> and <FormControlLabel> use
          FormControlLabel pairs a Checkbox with a label 2 in 1
            control prop takes the input component checkbox for display
            label takes in the typography label prop
        */}
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
          {/*
            Stack component arranges all the FormControlLabel vertically and applies spacing between
            for the checkbox since we set all options to true at the start they will all be checked
            for the onChange, we set to the toggleoption function that we had defined
            above which ensures at least one is checked at all times.
          */}
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
