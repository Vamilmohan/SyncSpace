import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PrivacyPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Privacy Policy
      </Typography>
      <Box>
        <Typography variant="h5" gutterBottom>1. Information We Collect</Typography>
        <Typography paragraph>
          We collect information you provide directly to us. For example, we collect information when you create an account, subscribe, participate in any interactive features of our services, fill out a form, request customer support or otherwise communicate with us.
        </Typography>
        <Typography variant="h5" gutterBottom>2. How We Use Information</Typography>
        <Typography paragraph>
          We may use the information we collect for various purposes, including to: provide, maintain and improve our services; send you technical notices, updates, security alerts and support and administrative messages; and respond to your comments, questions and requests and provide customer service.
        </Typography>
        <Typography variant="h5" gutterBottom>3. Lorem Ipsum</Typography>
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPage;