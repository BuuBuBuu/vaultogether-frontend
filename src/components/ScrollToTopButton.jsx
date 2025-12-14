import { useState, useEffect } from 'react';
import { Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTopButton = () => {
  // state to track visibility
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // clean up the event listener when the component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Run onece on mount

  return (
    <>
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
