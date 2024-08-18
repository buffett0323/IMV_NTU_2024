const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
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
      await existingUser.save();
      
      // Save user profile including email & deliveryAddress
      userProfile.email = existingUser.email;
      userProfile.deliveryAddress = existingUser.deliveryAddress;
      userProfile.premiereLevel = existingUser.premiereLevel;
      console.log("Find existing user:", existingUser);
      console.log("User Profile:", userProfile);
    } else {
      // Create new user
      const newUser = new User({
        lineUserId: userProfile.userId,
        displayName: userProfile.displayName,
        pictureUrl: userProfile.pictureUrl,
        email: "",
        deliveryAddress: "",
        premiereLevel: 0,
      });
      await newUser.save();

      // Save new user profile 
      // userProfile = newUser;
      console.log("Create new user:", newUser);
    }

    // Redirect to the frontend with user information or token
    console.log("Successfully login!");
    res.redirect(`http://localhost:3000/home?userId=${userProfile.userId}&displayName=${userProfile.displayName}&pictureUrl=${userProfile.pictureUrl}&email=${userProfile.email}&deliveryAddress=${userProfile.deliveryAddress}&premiereLevel=${userProfile.premiereLevel}`);
  } catch (error) {
    console.error('Error exchanging code for token or fetching profile:', error.response ? error.response.data : error.message);
    res.status(500).send('Authentication failed');
  }
});


// Update user info
router.put('/user/:userId', async (req, res) => {
  console.log("Update USER INFO:", req.body);
  const { lineUserId, displayName, email, deliveryAddress } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { lineUserId },
      { displayName, email, deliveryAddress },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Specify the directory to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
  }
});
const upload = multer({ storage: storage });


// Adding a product
router.post('/products', async (req, res) => {
  const { name, price, quantity, farmPlace, netWeight, pesticideRecord, lineUserId, lineUserName, imageBase64 } = req.body;
  
  const newProduct = new Product({
    name: name,
    price: price,
    quantity: quantity,
    lineUserName: lineUserName,
    lineUserId: lineUserId,
    farmPlace: farmPlace,
    netWeight: netWeight,
    pesticideRecord: pesticideRecord,
    productId: uuidv4(),
    timestamp: Date.now(),
    imageBase64: imageBase64,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});


// Get all products available
router.get('/products/:userId', async (req, res) => {
  try {
    const products = await Product.find({ userId: req.params.lineUserId });
    if (!products.length) {
      console.log('No products found for this user');
    } else {
      console.log('Find', products.length, "products!");
    }
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});


// Update a product
router.put('/products/:id', async (req, res) => {
  try {
      const updatedProduct = await Product.findOneAndUpdate(
          { productId: req.params.id },
          req.body,
          { new: true, runValidators: true }
      );
      if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
      else console.log("Successfully Update Product:", req.body );
      res.json(updatedProduct);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
      const deletedProduct = await Product.findOneAndDelete({ productId: req.params.id });
      if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
      else console.log("Successfully Delete Product:", req.params.id );
      res.json({ message: 'Product deleted' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Get all the products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new order
router.post('/orders', async (req, res) => {
  console.log("Create New Order!");
  const { userId, productId, productName, productPrice, quantity, totalAmount } = req.body;

  const newOrder = new Order({
    userId,
    productId,
    productName,
    productPrice,
    quantity,
    totalAmount,
  });

  try {
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Endpoint to get orders by userId
router.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Calculation of fertilizer
router.post('/calculate', (req, res) => {
  console.log("Calculate Data:", data);
  const data = req.body;
  const pythonProcess = spawn('python3', ['../calculation/calculate_and_plot.py', JSON.stringify(data)]);

  let result = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();  // Accumulate the output data
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    // Send the error back if necessary
    res.status(500).send({ error: data.toString() });
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      // Only send the response once the process has finished
      res.json({ result: result });
    } else {
      res.status(500).send({ error: `Process exited with code ${code}` });
    }
    console.log(`child process exited with code ${code}`);
  });
});


module.exports = router;
