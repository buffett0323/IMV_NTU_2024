const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const app = express();

// Construct the MongoDB URI using the password from the text file
const password = fs.readFileSync(path.join(__dirname, 'dbPassword.txt'), 'utf8').trim();
const uri = `mongodb+srv://buffett:${password}@imvntu2024.2zjdkz5.mongodb.net/?retryWrites=true&w=majority&appName=IMVNTU2024`;

// Connect to the mongoose
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connect to MongoDB");
  } catch (error) {
    console.error(error);
  }
}; 

connect();

app.listen(8000, () => {
  console.log("Server started on port 8000.")
});

// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);

// mongoose.connect('mongodb://localhost:27017/carbon-neutral-agriculture')
//   .then(() => app.listen(5000, () => console.log('Server is running on port 5000')))
//   .catch((err) => console.error(err));
