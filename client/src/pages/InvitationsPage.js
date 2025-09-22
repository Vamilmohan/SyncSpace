import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './InvitationsPage.css';

const InvitationsPage = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInvitations = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      setLoading(true);
      const { data } = await axios.get('/api/invitations/pending', config);
      setInvitations(data);
    } catch (err) {
      console.error('Could not fetch invitations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (invitationId) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`/api/invitations/${invitationId}/accept`, {}, config);
      alert('Invitation accepted! You are now a member of the workspace.');
      // Refresh the list of invitations
      fetchInvitations();
    } catch (err) {
      alert('Failed to accept invitation.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="invitations-container">
        <h1>Your Invitations</h1>
        {loading ? (
          <p>Loading invitations...</p>
        ) : (
          <ul className="invitations-list">
            {invitations.length > 0 ? (
              invitations.map(inv => (
                <li key={inv._id} className="invitation-card">
                  <div className="invitation-details">
                    <p>
                      You have been invited to join the <strong>{inv.workspace.name}</strong> workspace
                      by <strong>{inv.fromUser.name}</strong>.
                    </p>
                  </div>
                  <div className="invitation-actions">
                    <button onClick={() => handleAccept(inv._id)} className="accept-button">
                      Accept
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>You have no pending invitations.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InvitationsPage;