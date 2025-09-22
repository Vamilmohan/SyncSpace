import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const TermsPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Terms and Conditions
      </Typography>
      <Box>
        <Typography variant="h5" gutterBottom>1. Introduction</Typography>
        <Typography paragraph>
          Welcome to SyncSpace. These are the terms and conditions governing your access to and use of the website SyncSpace and its related sub-domains, sites, services, and tools. By using the Site, you hereby accept these terms and conditions and represent that you agree to comply with these terms and conditions.
        </Typography>
        <Typography variant="h5" gutterBottom>2. User Account</Typography>
        <Typography paragraph>
          To access certain services, you must create a user account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
        </Typography>
        <Typography variant="h5" gutterBottom>3. Lorem Ipsum</Typography>
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsPage;