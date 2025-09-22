import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notifications from './Notifications'; // Import the new component
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to={userInfo ? "/dashboard" : "/"} className="navbar-brand">
          SyncSpace
        </Link>

        {userInfo ? (
          <div className="navbar-user-info">
            <Link to="/invitations" style={{color: 'white', marginRight: '1rem'}}>Invitations</Link>
            <Notifications /> {/* Add the Notifications component here */}
            <span>Welcome, {userInfo.name}</span>
            <button className="navbar-logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;