import { useState, useEffect } from 'react';
// we need MUI's Floating Action Button (Fab) and Icon for this component
import { Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// this component provides a scroll to top button on bottom right when user
// scroll down at this jucture to 300px. clicking button scolls page to top
const ScrollToTopButton = () => {
  // --- State Management ---
  // state to track visibility
  const [showButton, setShowButton] = useState(false);

  // --- Effect Hook for Scroll Handling ---
  useEffect(() => {
    // handleScroll function that responds to scroll events
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Add the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // clean up the event listener when the component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Run onece on mount

  return (
    <>
      {/* --- Floating Action Button (FAB) --- */}
      {/*
        The FAB is conditionally rendered based on the showButton state.
        It is styled to be fixed at the bottom-right corner of the viewport.
        On click, it smoothly scrolls the window back to the top.
        onclick uses window.scrollTo with behavior 'smooth' for smooth scrolling effect.
      */}
      {showButton && (
        <Fab
          onClick={() => window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })}
          size="medium"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#d9d9d9',
            color: 'black',
            border: '2px solid #d9d9d9',
            '&:hover': {
              bgcolor: '#c5c5c5',
              borderColor: 'black',
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}

    </>

  );
};

export default ScrollToTopButton;
