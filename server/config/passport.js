const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      proxy: true // Important for services like Heroku or Render
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our database
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If user exists, just return them
          return done(null, user);
        } else {
          // If not, create a new user in our database
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            // We don't get a password from Google, so we will modify our User model later
            // to not require a password for OAuth users.
          });
          
          // We will save without password validation for now. This will require a model change.
          await newUser.save({ validateBeforeSave: false });
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback',
      scope: ['user:email'], // Important to get the user's email
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub may not always provide a public email, so we check the emails array
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          return done(new Error('Could not retrieve email from GitHub.'), null);
        }

        let user = await User.findOne({ email: email });

        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            name: profile.displayName || profile.username,
            email: email,
          });
          await newUser.save({ validateBeforeSave: false });
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
// These are required by Passport to manage the user session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});