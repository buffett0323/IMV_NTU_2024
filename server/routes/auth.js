const express = require('express');
const User = require('../models/user');
const router = express.Router();

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