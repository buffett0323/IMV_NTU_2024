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

    // Send user profile information to your backend
    // Example: Save the user profile to the database or create a session
    // await saveUserProfileToDatabase(userProfile);

    res.json(userProfile); // or redirect to a success page
  } catch (error) {
    console.error('Error exchanging code for token or fetching profile:', error.response ? error.response.data : error.message);
    res.status(500).send('Authentication failed');
  }
});


// Signup page
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log("Signup request received:", { email, password });

  try {
    const newUser = new User({ email, password });
    await newUser.save();
    console.log("User created successfully:", newUser);
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error("Error creating user:", error); 
    res.status(400).send({ error: 'User creation failed', details: error });
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received:", { email, password });

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      console.log("User found:", user);
      res.status(200).send({ message: 'Login successful' });
    } else {
      console.log("User not found or incorrect password");
      res.status(400).send({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Error during login:", error); 
    res.status(500).send({ error: 'Internal server error', details: error });
  }
});

module.exports = router;
