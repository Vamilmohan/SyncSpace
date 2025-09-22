const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/authController');
const generateToken = require('../utils/generateToken');

// Regular email/password routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Google OAuth Routes ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const user = req.user;
    const userJson = JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token
    });
    const encodedUser = encodeURIComponent(userJson);
    res.redirect(`http://localhost:3000/auth/callback?user=${encodedUser}`);
  }
);

// --- GitHub OAuth Routes ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // This logic is identical to the Google callback
    console.log('Google callback successful, user:', req.user); // ADD THIS LINE
    const token = generateToken(req.user._id);
    const user = req.user;
    const userJson = JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token
    });
    const encodedUser = encodeURIComponent(userJson);
    res.redirect(`http://localhost:3000/auth/callback?user=${encodedUser}`);
  }
);

module.exports = router;