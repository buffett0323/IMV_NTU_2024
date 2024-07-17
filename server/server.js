const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const app = express();

// Construct the MongoDB URI using the password from the text file
const password = fs.readFileSync(path.join(__dirname, 'password.txt'), 'utf8').trim();
const uri = `mongodb+srv://buffett:${password}@imvntu2024.2zjdkz5.mongodb.net/?retryWrites=true&w=majority&appName=IMVNTU2024`;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
}

connect();

app.listen(8000, () => {
  console.log('Server started on port 8000.');
});
