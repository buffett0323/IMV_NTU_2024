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

module.exports = router;
