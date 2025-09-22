import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Typography, Button, TextField, Grid, Card, CardContent, CardActionArea, CircularProgress } from '@mui/material';

const HomePage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchWorkspaces = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      setLoading(true);
      const { data } = await axios.get('/api/workspaces', config);
      setWorkspaces(data);
    } catch (err) {
      setError('Could not fetch workspaces.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo && storedUserInfo.token) {
      fetchWorkspaces(storedUserInfo.token);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName) return;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.post('/api/workspaces', { name: newWorkspaceName }, config);
      setNewWorkspaceName('');
      fetchWorkspaces(userInfo.token);
    } catch (err) {
      setError('Could not create workspace.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Your Workspaces
        </Typography>
        <Box component="form" onSubmit={handleCreateWorkspace} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="New workspace name"
            variant="outlined"
            size="small"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            required
          />
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Box>
      </Box>
      
      {error && <Typography color="error">{error}</Typography>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {workspaces.map((ws) => (
            <Grid item key={ws._id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea component={RouterLink} to={`/workspace/${ws._id}`} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {ws.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {ws.members ? ws.members.length : 0} member(s)
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;