import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all our pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WorkspacePage from './pages/WorkspacePage';
import HelpPage from './pages/HelpPage';
import InvitationsPage from './pages/InvitationsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AuthCallback from './pages/AuthCallback.js';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import KanbanPage from './pages/KanbanPage';
import DocumentsPage from './pages/DocumentsPage';
import ChatPage from './pages/ChatPage';
import FilesPage from './pages/FilesPage';
import NotificationsPage from './pages/NotificationsPage';

// Import components
import Layout from './components/Layout';
import './App.css';

const PrivateRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Private Routes */}
          <Route path="/dashboard" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/workspace/:id" element={<PrivateRoute><WorkspacePage /></PrivateRoute>} />
          <Route path="/invitations" element={<PrivateRoute><InvitationsPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="/help" element={<PrivateRoute><HelpPage /></PrivateRoute>} />
          <Route path="/boards" element={<PrivateRoute><KanbanPage /></PrivateRoute>} />
          <Route path="/documents" element={<PrivateRoute><DocumentsPage /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/files" element={<PrivateRoute><FilesPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;