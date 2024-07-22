const express = require('express');
const axios = require('axios');
const User = require('../models/user');
const router = express.Router();

const clientId = '2005899680';
const clientSecret = 'fb1c25c861ce3f9cf3519375bc3e1361';
const redirectUri = 'http://localhost:8000/api/auth/callback';


// Functions to catch the line login information
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;

    // Use the access token to get user profile information
    const profileResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userProfile = profileResponse.data;

    // Save user profile to MongoDB
    const existingUser = await User.findOne({ lineUserId: userProfile.userId });
    if (existingUser) {
      // Update existing user
      existingUser.displayName = userProfile.displayName;
      existingUser.pictureUrl = userProfile.pictureUrl;
      existingUser.statusMessage = userProfile.statusMessage;
      await existingUser.save();
      console.log("Find existing user:", existingUser);
    } else {
      // Create new user
      const newUser = new User({
        lineUserId: userProfile.userId,
        displayName: userProfile.displayName,
        pictureUrl: userProfile.pictureUrl,
        statusMessage: userProfile.statusMessage,
      });
      await newUser.save();
      console.log("Create new user:", newUser);
    }

    // Redirect to the frontend with user information or token
    console.log("Successfully login!");
    res.redirect(`http://localhost:3000/?userId=${userProfile.userId}&displayName=${userProfile.displayName}`);
  } catch (error) {
    console.error('Error exchanging code for token or fetching profile:', error.response ? error.response.data : error.message);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
