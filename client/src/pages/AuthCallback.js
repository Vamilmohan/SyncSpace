import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This component handles the redirect from Google/GitHub OAuth
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');

    if (userParam) {
      try {
        // The user data is already a complete JSON string with the token
        const decodedUser = decodeURIComponent(userParam);
        localStorage.setItem('userInfo', decodedUser);
        
        // Redirect to the dashboard now that login is saved
        window.location.href = '/dashboard';
      } catch (error) {
        console.error("Failed to parse user data from URL", error);
        navigate('/login');
      }
    } else {
      // No user data found, something went wrong
      console.error("Auth callback called without user data.");
      navigate('/login');
    }
    // The navigate function is stable, but it's good practice to include it
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Finalizing login...</Typography>
    </Box>
  );
};

export default AuthCallback;