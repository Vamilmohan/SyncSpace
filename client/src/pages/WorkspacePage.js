import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './WorkspacePage.css';

const WorkspacePage = () => {
  const { id: workspaceId } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workspaceName, setWorkspaceName] = useState('Workspace');
  const [inviteEmail, setInviteEmail] = useState(''); // State for invite form

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchDocuments = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        setLoading(true);
        const { data } = await axios.get(`/api/workspaces/${workspaceId}/documents`, config);
        setDocuments(data);
      } catch (err) {
        setError('Could not fetch documents.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [workspaceId, navigate]);

  const handleCreateDocument = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('/api/documents', { workspaceId }, config);
      navigate(`/document/${data._id}`);
    } catch (err) {
      setError('Could not create new document.');
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const body = { email: inviteEmail, workspaceId };
      await axios.post('/api/invitations', body, config);
      alert('Invitation sent successfully!'); // Simple feedback for now
      setInviteEmail('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send invitation.');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="workspace-container">
        <header className="workspace-header">
          <h1>{workspaceName}</h1>
          <Link to="/dashboard">Back to Main Dashboard</Link>
        </header>

        <section className="workspace-section">
          <h2><Link to={`/workspace/${workspaceId}/board`}>Kanban Board</Link></h2>
          <p>Organize your tasks with a drag-and-drop board.</p>
        </section>

        <section className="workspace-section">
          <h2>Documents</h2>
          <button onClick={handleCreateDocument} className="create-doc-button">+ Create New Document</button>
          <ul className="document-list">
            {documents.length > 0 ? (
              documents.map(doc => (
                <li key={doc._id} className="document-list-item">
                  <Link to={`/document/${doc._id}`}>{doc.title || 'Untitled Document'}</Link>
                  <span>Created: {new Date(doc.createdAt).toLocaleDateString()}</span>
                </li>
              ))
            ) : (
              !loading && <p>No documents found. Create one to get started!</p>
            )}
          </ul>
        </section>

        <section className="workspace-section">
          <h2>Team Members</h2>
          <form onSubmit={handleInviteUser} className="invite-form">
            <input
              type="email"
              placeholder="Enter user's email to invite"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <button type="submit">Send Invite</button>
          </form>
          {/* We will list members here in a future step */}
        </section>
      </main>
    </div>
  );
};

export default WorkspacePage;