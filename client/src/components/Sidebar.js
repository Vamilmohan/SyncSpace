import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = () => {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('/api/workspaces', config);
          setWorkspaces(data);
        } catch (error) {
          console.error("Could not fetch workspaces for sidebar", error);
        }
      }
    };
    fetchWorkspaces();
  }, []);

  const mainLinks = [
    { text: 'Home', path: '/dashboard' },
    // Add other main links here if needed
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2>SyncSpace</h2>
      </div>
      <button className="sidebar-create-button">
        <span>&#43;</span>
        <span>Create new task</span>
      </button>
      <nav>
        <ul className="sidebar-nav-list">
          {mainLinks.map(link => (
            <li key={link.text}>
              <Link to={link.path}>
                <span className="nav-icon"></span>
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <hr className="sidebar-divider" />
      <h3 className="sidebar-projects-header">Projects</h3>
      <ul className="sidebar-nav-list">
        {workspaces.map(ws => (
          <li key={ws._id}>
            <Link to={`/workspace/${ws._id}`}>{ws.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;