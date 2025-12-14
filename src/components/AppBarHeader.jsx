import React from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, Input, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import SearchIcon from '@mui/icons-material/Search';

const AppBarHeader = ({ title, subtitle, onBack, rightAction, searchValue, onSearchChange, showSearch }) => {

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "2px solid #d9d9d9", bgcolor: "#ffffff" }}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <LockOutlinedIcon sx={{ fontSize: onBack ? 28 : 32 }} />
          <Box>
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

        {rightAction}

      </Toolbar>

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
