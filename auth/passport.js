require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/users.model'); // Import your user model

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: '/auth/google/callback',
}, (token, tokenSecret, profile, done) => {

    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName || '',
        email: profile.emails[0].value,
        userType: 'shopper'
    };
    
    const user = userModel.getUserByGoogleId(profile.id);
    if (!user) {
        console.log('passport user checked');
        userModel.createUser(Object.values(newUser));
    }
    return done(null, profile);
}));


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});