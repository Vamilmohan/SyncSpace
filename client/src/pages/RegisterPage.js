import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 1. Add state for visibility
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  // 2. Add the toggle handler function
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-branding-section">
        SyncSpace
      </div>
      <div className="auth-form-container">
        <div className="auth-form-box">
          <h1>Create an account</h1>
          <p>Start your journey with the best collaboration tool.</p>

           <div className="social-signup-buttons">
            <a href="http://localhost:5001/api/auth/google" className="social-btn">
              Sign up with Google
            </a>
            <a href="http://localhost:5001/api/auth/github" className="social-btn">
              Sign up with GitHub
            </a>
           </div>

          <div className="divider-text">OR CONTINUE WITH</div>

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  // 3. Make the type dynamic
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={handlePasswordToggle} // 4. Add the click handler
                >
                  {/* 5. Change text based on state */}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {error && <p className="auth-form-error">{error}</p>}
            <button type="submit" className="auth-form-button">
              Create account
            </button>
          </form>
          <div className="auth-form-switch-link">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;