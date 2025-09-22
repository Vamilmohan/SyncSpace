import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography, Grid, AppBar, Toolbar, Avatar } from '@mui/material';
import CollaborationIcon from '@mui/icons-material/Group';
import DocumentIcon from '@mui/icons-material/Article';
import SecureIcon from '@mui/icons-material/Security';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import './LandingPage.css';

const heroImageUrl = 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070';

const reviews = [
  {
    name: 'Jane Doe',
    role: 'Project Manager',
    avatar: 'https://i.pravatar.cc/150?img=1',
    quote: 'SyncSpace has revolutionized how our team collaborates. The real-time document editing is a game-changer!'
  },
  {
    name: 'John Smith',
    role: 'Software Engineer',
    avatar: 'https://i.pravatar.cc/150?img=3',
    quote: 'An essential tool for any remote team. The workspace organization is intuitive and keeps everything in one place.'
  },
  {
    name: 'Emily White',
    role: 'UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=5',
    quote: 'Finally, a collaboration tool that is both powerful and beautiful. The user interface is clean and easy to navigate.'
  }
];

const LandingPage = () => {
  return (
    <Box>
      {/* Header with new Logo */}
      <AppBar position="static" className="app-bar">
        <Toolbar>
          <RouterLink to="/" className="logo-container">
            <Box className="logo-mark">S</Box>
            <Typography variant="h6" className="logo-text">
              SyncSpace
            </Typography>
          </RouterLink>
          <Button component={RouterLink} to="/login" color="inherit" className="nav-button">Login</Button>
          <Button component={RouterLink} to="/register" variant="outlined" color="primary" className="nav-button">Sign Up</Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box className="landing-hero">
        <Box
          className="hero-background"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        />
        <Container maxWidth="md" className="hero-content">
          <Typography variant="h1" component="h1" gutterBottom>
            Collaborate Without Limits
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4 }}>
            SyncSpace is your all-in-one platform for team projects, document sharing, and real-time collaboration.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            className="cta-button"
          >
            Get Started for Free
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" className="features-section">
        <Typography variant="h4" component="h2" gutterBottom>
          Everything You Need in One Space
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Box className="feature-card">
              <CollaborationIcon className="feature-icon" />
              <Typography variant="h6" component="h3" gutterBottom>
                Seamless Collaboration
              </Typography>
              <Typography>
                Create workspaces, manage boards, and keep your team in sync with our intuitive project management tools.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className="feature-card">
              <DocumentIcon className="feature-icon" />
              <Typography variant="h6" component="h3" gutterBottom>
                Real-Time Document Editing
              </Typography>
              <Typography>
                Co-author documents in real-time, with changes saved instantly. Say goodbye to version control headaches.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className="feature-card">
              <SecureIcon className="feature-icon" />
              <Typography variant="h6" component="h3" gutterBottom>
                Secure & Reliable
              </Typography>
              <Typography>
                Your data is safe with us. We use industry-standard security to protect your workspaces and documents.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Reviews Section - Grid updated for better side-by-side layout */}
      <Box className="reviews-section">
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom>
            Loved by Teams Worldwide
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }} justifyContent="center">
            {reviews.map((review, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box className="review-card">
                  <Avatar src={review.avatar} alt={review.name} className="review-avatar" />
                  <Typography className="review-text">
                    "{review.quote}"
                  </Typography>
                  <Typography className="review-author">
                    - {review.name}, {review.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box className="footer">
        <Container maxWidth="lg">
          <Typography variant="h6" gutterBottom>Contact Us</Typography>
          <Box className="social-icons" sx={{ my: 2 }}>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><GitHubIcon /></a>
            <a href="mailto:contact@syncspace.com"><EmailIcon /></a>
          </Box>
          <Box className="footer-links" sx={{ my: 2 }}>
            <RouterLink to="/privacy">Privacy Policy</RouterLink>
            <RouterLink to="/terms">Terms & Conditions</RouterLink>
          </Box>
          <Typography variant="body2">
            © {new Date().getFullYear()} SyncSpace. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;