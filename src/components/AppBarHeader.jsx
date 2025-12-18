import React from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, Input, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import SearchIcon from '@mui/icons-material/Search';

// A reusable AppBar component
const AppBarHeader = ({ title, subtitle, onBack, rightAction, searchValue, onSearchChange, showSearch }) => {

  return (
    // AppBar serves as the main container for the header.
    // `position="sticky"` makes it stick to the top of the viewport on scroll.
    // It's styled to be transparent with a white background and a bottom border
    // to separate it from the content.
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "2px solid #d9d9d9", bgcolor: "#ffffff" }}
    >
      {/*
        Toolbar is used to structure the content within the AppBar, typically horizontally.
        height is set to 80px for a taller header.
        maxWidth and mx center the content and limit its width on larger screens.
        px adds horizontal padding that adjusts for different screen sizes (xs and md).
      */}
      <Toolbar
        sx={{
          height: 80,
          maxWidth: "lg",
          mx: "auto",
          width: "100%",
          px: { xs: 2, md: 4 },
        }}
      >
        {/* --- Conditional Back Button --- */}
        {/* This block renders the back button only if the onBack prop (function) is provided */}
        {onBack && (
          <IconButton
            onClick={onBack}
            sx={{
              mr: 2,
              color: 'text.primary',
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        {/* --- Title and Subtitle Section --- */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <LockOutlinedIcon sx={{ fontSize: onBack ? 28 : 32 }} />
          <Box>
            {/* main title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                fontFamily: 'Fira Mono, monospace',
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            {/* subtitle only rendered if the `subtitle` prop is provided */}
            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'Fira Mono, monospace',
                  color: 'text.secondary',
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* --- Right Action Section --- */}
        {/* This renders any component passed in via the rightaction prop logout button */}
        {rightAction}

      </Toolbar>

      {/* --- Conditional Search Bar -- */}
      {/* only rendered if the `showSearch` prop is true as not all need search such as password generator */}
      {showSearch && (
        <Container maxWidth="lg" sx={{ px: {xs: 2, md: 4}, pb: 2}}>
          <Input
            id="search-bar"
            value={searchValue}
            onChange={onSearchChange}
            startAdornment={
              <SearchIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20}} />
            }
            fullWidth
            disableUnderline
            inputProps={{
              maxLength: 100
            }}
            placeholder="Search..."
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
        </Container>
      )}
    </AppBar>
  );
};

export default AppBarHeader;
