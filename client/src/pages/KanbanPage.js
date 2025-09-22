import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Container, Typography, Paper, CircularProgress, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem, IconButton, Menu } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import './KanbanPage.css';

const columns = ['To Do', 'In Progress', 'Review', 'Done'];

const KanbanPage = () => {
  const [tasks, setTasks] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  
  const [anchorEl, setAnchorEl] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchData = useCallback(async (workspaceId) => {
    if (!userInfo?.token) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: workspacesData } = await axios.get('/api/workspaces', config);
      setWorkspaces(workspacesData);
      
      const targetWorkspaceId = workspaceId || (workspacesData.length > 0 ? workspacesData[0]._id : null);
      if (targetWorkspaceId) {
        setActiveWorkspace(targetWorkspaceId);
        const { data: tasksData } = await axios.get(`/api/tasks/workspace/${targetWorkspaceId}`, config);
        setTasks(tasksData);
      }
    } catch (err) {
      console.error("Failed to fetch data.", err);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (task = null) => {
    if (task) {
      setIsEditing(true);
      setCurrentTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    } else {
      setIsEditing(false);
      setCurrentTask(null);
      setTitle('');
      setDescription('');
      setStatus('To Do');
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveTask = async () => {
    const taskData = { title, description, status, workspaceId: activeWorkspace };
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      if (isEditing) {
        await axios.put(`/api/tasks/${currentTask._id}`, taskData, config);
      } else {
        await axios.post('/api/tasks', taskData, config);
      }
      fetchData(activeWorkspace);
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  const handleDeleteTask = async () => {
    if (!currentTask) return;
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
        await axios.delete(`/api/tasks/${currentTask._id}`, config);
        fetchData(activeWorkspace);
        handleMenuClose();
    } catch(err) {
        console.error("Failed to delete task", err);
    }
  }

  const handleMenuClick = (event, task) => {
    event.stopPropagation(); // <-- THE FIX IS HERE (changed 'e' to 'event')
    setAnchorEl(event.currentTarget);
    setCurrentTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentTask(null);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">Kanban Board</Typography>
        <Box>
          <Select value={activeWorkspace} onChange={(e) => fetchData(e.target.value)} displayEmpty sx={{mr: 2, minWidth: 180}}>
            {workspaces.map(ws => <MenuItem key={ws._id} value={ws._id}>{ws.name}</MenuItem>)}
          </Select>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()} disabled={!activeWorkspace}>
            Add Task
          </Button>
        </Box>
      </Box>

      <Box className="kanban-board">
        {columns.map(columnName => (
          <Paper key={columnName} className="kanban-column">
            <Typography className="column-title">{columnName}</Typography>
            <Box className="tasks-container">
              {tasks.filter(t => t.status === columnName).map(task => (
                <Paper key={task._id} className="task-card" onClick={() => handleOpenModal(task)}>
                  <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography className="task-title">{task.title}</Typography>
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, task)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography className="task-description">{task.description}</Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Edit/Delete Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleOpenModal(currentTask); handleMenuClose(); }}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteTask} sx={{color: 'error.main'}}>Delete</MenuItem>
      </Menu>

      {/* Add/Edit Task Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Title" type="text" fullWidth variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} sx={{mb: 2}}/>
          <TextField margin="dense" label="Description" type="text" fullWidth multiline rows={4} variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} sx={{mb: 2}}/>
          <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)} fullWidth>
            {columns.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained">{isEditing ? 'Save Changes' : 'Create Task'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default KanbanPage;