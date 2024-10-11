require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 8000;

// Construct the MongoDB URI using the password from the text file
const uri = process.env.MONGO_URI;

const corsOptions = {
  origin: ['https://imv-ntu-2024.com'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); //app.use(cors());

// Increase the request size limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Serve static files from the 'uploads' directory
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

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

app.listen(PORT, () => {
  console.log(`Server now started on port ${PORT}.`);
});
