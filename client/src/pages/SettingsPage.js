import React from 'react';
import { Typography, Container } from '@mui/material';

const SettingsPage = () => {
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>
      <Typography>
        This is where user settings will go.
      </Typography>
    </Container>
  );
};

export default SettingsPage;