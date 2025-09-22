import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Avatar, TextField, Grid, Tabs, Tab, Paper, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, FormGroup, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import './ProfilePage.css';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box className="tab-panel">{children}</Box>}
    </div>
  );
};

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});
  // Profile Tab State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');
  const [isEditMode, setIsEditMode] = useState(false); // New state for edit mode

  // ... (other state variables are the same)
  const [notificationSettings, setNotificationSettings] = useState({ onMention: true, onNewTask: true, weeklySummary: false });
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);

  const populateForm = () => {
    const latestUserInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    setUserInfo(latestUserInfo);
    setName(latestUserInfo.name || '');
    setBio(latestUserInfo.bio || '');
    setRole(latestUserInfo.role || 'Not Specified');
    setNotificationSettings(latestUserInfo.notificationSettings || { onMention: true, onNewTask: true, weeklySummary: false });
  };

  useEffect(() => {
    populateForm();
  }, [tabValue]);
  
  const handleCancelEdit = () => {
    populateForm(); // Reset form to original data
    setIsEditMode(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put('/api/users/profile', { name, bio, role }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      setToast({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      setIsEditMode(false); // Exit edit mode on success
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.message || 'Update failed', severity: 'error' });
    }
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleToastClose = () => setToast({ ...toast, open: false });
  const handleNotificationChange = (e) => {
    setNotificationSettings({ ...notificationSettings, [e.target.name]: e.target.checked });
  };
  const handleNotificationSubmit = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.put('/api/users/profile', { notificationSettings }, config);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUserInfo(data);
        setToast({ open: true, message: 'Notification settings updated!', severity: 'success' });
    } catch (err) {
        setToast({ open: true, message: err.response?.data?.message || 'Update failed', severity: 'error' });
    }
  };
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
        setToast({ open: true, message: 'New passwords do not match!', severity: 'error' });
        return;
    }
    try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put('/api/users/profile/change-password', { currentPassword, newPassword }, config);
        setToast({ open: true, message: 'Password changed successfully!', severity: 'success' });
        setPasswordModalOpen(false);
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
        setToast({ open: true, message: err.response?.data?.message || 'Failed to change password', severity: 'error' });
    }
  };

  const roleOptions = ['Developer', 'Designer', 'Project Manager', 'Client', 'Not Specified'];

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box className="profile-header">
          <Avatar className="profile-avatar" src={`https://i.pravatar.cc/150?u=${userInfo.email}`} />
          <Box>
            <Typography variant="h4">{userInfo.name}</Typography>
            <Typography variant="body1" color="textSecondary">{userInfo.email}</Typography>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}><Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Profile" />
            <Tab label="Account" />
            <Tab label="Notifications" />
        </Tabs></Box>

        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleProfileSubmit} className="profile-form-container">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditMode} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Email Address" value={userInfo.email} disabled /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Short Bio" multiline rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a little about yourself" disabled={!isEditMode} /></Grid>
              <Grid item xs={12} sm={6}><FormControl fullWidth disabled={!isEditMode}><InputLabel>Role</InputLabel><Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>{roleOptions.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl></Grid>
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                {isEditMode ? (
                  <Box>
                    <Button onClick={handleCancelEdit} sx={{ mr: 2 }}>Cancel</Button>
                    <Button type="submit" variant="contained">Save Changes</Button>
                  </Box>
                ) : (
                  <Button variant="outlined" onClick={() => setIsEditMode(true)}>Edit Profile</Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>Account Settings</Typography>
            <Box className="account-actions">
                <Button variant="outlined" onClick={() => setPasswordModalOpen(true)}>Change Password</Button>
                <Button variant="contained" color="error" disabled>Delete Account</Button>
                <Typography variant="body2" color="textSecondary" sx={{mt: 1}}>*Account deletion is permanent and cannot be undone.</Typography>
            </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Notification Settings</Typography>
            <FormGroup>
                <FormControlLabel control={<Switch checked={notificationSettings.onMention} onChange={handleNotificationChange} name="onMention" />} label="Email notifications for mentions" />
                <FormControlLabel control={<Switch checked={notificationSettings.onNewTask} onChange={handleNotificationChange} name="onNewTask" />} label="Email notifications for new tasks" />
                <FormControlLabel control={<Switch checked={notificationSettings.weeklySummary} onChange={handleNotificationChange} name="weeklySummary" />} label="Weekly activity summary email" />
            </FormGroup>
            <Button variant="contained" sx={{mt: 2}} onClick={handleNotificationSubmit}>Save Notification Settings</Button>
        </TabPanel>
      </Paper>

      <Dialog open={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent><Grid container spacing={2} sx={{pt: 1}}>
            <Grid item xs={12}><TextField type="password" fullWidth label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/></Grid>
            <Grid item xs={12}><TextField type="password" fullWidth label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/></Grid>
            <Grid item xs={12}><TextField type="password" fullWidth label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/></Grid>
        </Grid></DialogContent>
        <DialogActions><Button onClick={() => setPasswordModalOpen(false)}>Cancel</Button><Button onClick={handleChangePassword} variant="contained">Update Password</Button></DialogActions>
      </Dialog>
      
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleToastClose}><Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert></Snackbar>
    </Container>
  );
};
export default ProfilePage;