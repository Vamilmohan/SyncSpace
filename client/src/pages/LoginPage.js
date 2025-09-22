import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Grid, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/github';
  };

  return (
    <Grid container component="main" className="login-container">
      {/* Image Panel */}
      <Grid item xs={12} sm={6} md={6} className="image-panel">
        <Box className="image-overlay" />
        <Box className="image-panel-content">
          <Typography component="h1" variant="h2">
            SyncSpace
          </Typography>
          <Typography variant="h6">
            Your All-In-One Collaboration Hub
          </Typography>
        </Box>
      </Grid>
      
      {/* Form Panel */}
      <Grid item xs={12} sm={6} md={6} className="form-panel">
        <Container component="div" maxWidth="xs" className="form-container">
          <Typography component="h1" variant="h4" gutterBottom>
            Login
          </Typography>
          
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleLogin}>
                Login with Google
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="outlined" startIcon={<GitHubIcon />} onClick={handleGitHubLogin}>
                Login with GitHub
              </Button>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }}>OR</Divider>

          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#1976d2' }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item>
                <RouterLink to="/register" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2">
                    Don't have an account? Sign Up
                  </Typography>
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default LoginPage;