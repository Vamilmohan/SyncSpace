import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Container, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, TextField, DialogActions, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { format } from 'date-fns';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isRenameModalOpen, setRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentName, setDocumentName] = useState('');
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchWorkspacesAndDocuments = useCallback(async (workspaceId) => {
    if (!userInfo?.token) return;
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: workspacesData } = await axios.get('/api/workspaces', config);
      setWorkspaces(workspacesData);

      const targetWorkspaceId = workspaceId || (workspacesData.length > 0 ? workspacesData[0]._id : null);

      if (targetWorkspaceId) {
        setActiveWorkspace(targetWorkspaceId);
        const { data: documentsData } = await axios.get(`/api/documents/workspace/${targetWorkspaceId}`, config);
        setDocuments(documentsData);
      } else {
         setDocuments([]);
      }
    } catch (err) {
      setError('Failed to fetch data. Ensure you have created at least one workspace.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.token]);

  useEffect(() => {
    fetchWorkspacesAndDocuments();
  }, [fetchWorkspacesAndDocuments]);

  const handleWorkspaceChange = (e) => {
    const newWorkspaceId = e.target.value;
    fetchWorkspacesAndDocuments(newWorkspaceId);
  };

  const handleMenuClick = (event, doc) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoc(doc);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoc(null);
  };

  const handleCreate = async () => {
    if (!documentName || !activeWorkspace) return;
    try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.post('/api/documents', { name: documentName, workspaceId: activeWorkspace }, config);
        setCreateModalOpen(false);
        setDocumentName('');
        fetchWorkspacesAndDocuments(activeWorkspace);
    } catch (err) { console.error("Failed to create document", err); }
  };

  const handleRename = async () => {
    if (!documentName) return;
    try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`/api/documents/${selectedDoc._id}`, { name: documentName }, config);
        setRenameModalOpen(false);
        setDocumentName('');
        fetchWorkspacesAndDocuments(activeWorkspace);
    } catch (err) { console.error("Failed to rename document", err); }
  };

  const handleDelete = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/documents/${selectedDoc._id}`, config);
        setDeleteModalOpen(false);
        fetchWorkspacesAndDocuments(activeWorkspace);
    } catch (err) { console.error("Failed to delete document", err); }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">Documents</Typography>
        <Box>
            <Select value={activeWorkspace} onChange={handleWorkspaceChange} displayEmpty sx={{mr: 2}}>
                {workspaces.map(ws => <MenuItem key={ws._id} value={ws._id}>{ws.name}</MenuItem>)}
            </Select>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModalOpen(true)} disabled={!activeWorkspace}>
                Create Document
            </Button>
        </Box>
      </Box>

      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box> :
       error ? <Typography color="error" sx={{ mb: 2 }}>{error}</Typography> :
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc._id} hover>
                <TableCell>{doc.name}</TableCell>
                {/* THIS IS THE FIX: */}
                <TableCell>{doc.createdBy ? doc.createdBy.name : 'Unknown User'}</TableCell>
                <TableCell>{format(new Date(doc.updatedAt), 'PPpp')}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuClick(e, doc)}><MoreVertIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { setRenameModalOpen(true); setDocumentName(selectedDoc.name); handleMenuClose(); }}>Rename</MenuItem>
        <MenuItem onClick={() => { alert('Share functionality to be implemented.'); handleMenuClose(); }}>Share</MenuItem>
        <MenuItem onClick={() => { setDeleteModalOpen(true); handleMenuClose(); }} sx={{color: 'error.main'}}>Delete</MenuItem>
      </Menu>

      <Dialog open={isCreateModalOpen} onClose={() => setCreateModalOpen(false)}>
        <DialogTitle>Create New Document</DialogTitle>
        <DialogContent><TextField autoFocus margin="dense" label="Document Name" type="text" fullWidth variant="standard" value={documentName} onChange={(e) => setDocumentName(e.target.value)} /></DialogContent>
        <DialogActions><Button onClick={() => setCreateModalOpen(false)}>Cancel</Button><Button onClick={handleCreate}>Create</Button></DialogActions>
      </Dialog>

      <Dialog open={isRenameModalOpen} onClose={() => setRenameModalOpen(false)}>
        <DialogTitle>Rename Document</DialogTitle>
        <DialogContent><TextField autoFocus margin="dense" label="New Document Name" type="text" fullWidth variant="standard" value={documentName} onChange={(e) => setDocumentName(e.target.value)} /></DialogContent>
        <DialogActions><Button onClick={() => setRenameModalOpen(false)}>Cancel</Button><Button onClick={handleRename}>Rename</Button></DialogActions>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete "{selectedDoc?.name}"? This action cannot be undone.</Typography></DialogContent>
        <DialogActions><Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button onClick={handleDelete} color="error">Delete</Button></DialogActions>
      </Dialog>
    </Container>
  );
};

export default DocumentsPage;