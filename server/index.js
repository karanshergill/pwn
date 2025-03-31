
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

app.use(session({ secret: 's3cret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Serialize user into session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    console.log('✔️ OAuth Success:', profile);
    console.log('✔️ Access Token:', accessToken);
    console.log('✔️ Refresh Token:', refreshToken);
    return done(null, profile);
}));

// Routes
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) {
            console.error('🔥 Passport Auth Error:', err);
            return res.status(500).send(`<pre>${err.message || err}</pre>`);
        }
        if (!user) return res.redirect('/');
        req.logIn(user, err => {
            if (err) return next(err);
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});

app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');
    res.send(`<h1>Welcome ${req.user.displayName}</h1>`);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
