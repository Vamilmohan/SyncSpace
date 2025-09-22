import React from 'react';
import { Link } from 'react-router-dom';
import './HelpButton.css'; // Make sure to import the new CSS file name

const HelpButton = () => {
  return (
    <div className="help-button-container">
      <span className="help-button-tagline">Help</span>
      <Link to="/help" className="help-button">
        {/* Simple SVG Chat Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </Link>
    </div>
  );
};

export default HelpButton;