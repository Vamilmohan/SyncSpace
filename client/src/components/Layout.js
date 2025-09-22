import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Collapse, CircularProgress, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ArticleIcon from '@mui/icons-material/Article';
import ChatIcon from '@mui/icons-material/Chat';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HelpButton from './HelpButton';
import axios from 'axios';
import './Layout.css';

const collapsedDrawerWidth = 80;
const expandedDrawerWidth = 260;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [workspacesOpen, setWorkspacesOpen] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!userInfo?.token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/workspaces', config);
        setWorkspaces(data);
      } catch (err) {
        console.error('Could not fetch workspaces.');
      } finally {
        setLoadingWorkspaces(false);
      }
    };
    fetchWorkspaces();
  }, [userInfo?.token]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };
  
  const mainNavItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Kanban Boards', icon: <ViewKanbanIcon />, path: '/boards' },
    { text: 'Documents', icon: <ArticleIcon />, path: '/documents' },
    { text: 'Team Chat', icon: <ChatIcon />, path: '/chat' },
    { text: 'Files & Versions', icon: <CloudUploadIcon />, path: '/files' },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  ];

  const drawerContent = (
    <div className="sidebar">
      <Box className={isCollapsed ? "sidebar-header-collapsed" : "sidebar-header"}>
        {!isCollapsed && (
          <RouterLink to="/" className="logo-container">
            <Box className="logo-mark">S</Box>
            <Typography className="logo-text">SyncSpace</Typography>
          </RouterLink>
        )}
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <MenuIcon sx={{ color: 'white' }} />
        </IconButton>
      </Box>
      <List className="sidebar-list">
        {mainNavItems.map((item) => (
          <NavLink to={item.path} key={item.text} className="list-item-link">
            <ListItem button>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.text} />}
            </ListItem>
          </NavLink>
        ))}
        <ListItem button onClick={() => setWorkspacesOpen(!workspacesOpen)}>
          <ListItemIcon><FolderIcon /></ListItemIcon>
          {!isCollapsed && <ListItemText primary="Workspaces" />}
          {!isCollapsed && (workspacesOpen ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
        <Collapse in={workspacesOpen && !isCollapsed} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {loadingWorkspaces ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress size={24} color="inherit" /></Box>
            ) : (
              workspaces.map(ws => (
                <NavLink to={`/workspace/${ws._id}`} key={ws._id} className="list-item-link nested-list-item">
                  <ListItem button>
                    <ListItemText primary={ws.name} />
                  </ListItem>
                </NavLink>
              ))
            )}
          </List>
        </Collapse>
      </List>
      <Box sx={{ mt: 'auto' }}>
        <NavLink to="/profile" className="list-item-link">
          <ListItem button>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            {!isCollapsed && <ListItemText primary="Profile & Settings" />}
          </ListItem>
        </NavLink>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          {!isCollapsed && <ListItemText primary="Logout" />}
        </ListItem>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: isCollapsed ? collapsedDrawerWidth : expandedDrawerWidth,
          '& .MuiDrawer-paper': {
            width: isCollapsed ? collapsedDrawerWidth : expandedDrawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            transition: 'width 0.3s ease-in-out',
            overflowX: 'hidden',
          },
        }}
        anchor="left"
      >
        {drawerContent}
      </Drawer>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default', 
          p: 3, 
          transition: 'margin-left 0.3s ease-in-out',
          marginLeft: isCollapsed ? `${collapsedDrawerWidth}px` : `${expandedDrawerWidth}px`,
          paddingTop: '64px'
        }}
      >
        {children}
        <HelpButton />
      </Box>
    </Box>
  );
};

export default Layout;