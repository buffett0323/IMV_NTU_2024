const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const Seller = require('../models/seller');
const Fertilizer = require('../models/fertilizer');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const router = express.Router();
const XLSX = require('xlsx');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fertilizer = require('../models/fertilizer');

const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = `${process.env.REACT_APP_SERVER_URL}/api/auth/callback`;
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET;


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

    // Check if user already exists in MongoDB
    let existingUser = await User.findOne({ lineUserId: userProfile.userId });
    if (existingUser) {
      // Update existing user
      existingUser.displayName = userProfile.displayName;

      // Check for an empty email and update if necessary
      if (!existingUser.email || existingUser.email.trim() === "") {
        existingUser.email = `no-email-${existingUser.lineUserId}@example.com`;
      }

      await existingUser.save();
      console.log("Existing User:", existingUser);

      // Redirect to frontend with updated user information
      res.redirect(`${process.env.REACT_APP_URL}/home?userId=${existingUser.lineUserId}&displayName=${existingUser.displayName}&pictureUrl=${existingUser.pictureUrl}&email=${existingUser.email}&deliveryAddress=${existingUser.deliveryAddress}&premiereLevel=${existingUser.premiereLevel}`);
    } else {
      // Create a new user
      const newUser = new User({
        lineUserId: userProfile.userId,
        displayName: userProfile.displayName,
        pictureUrl: userProfile.pictureUrl,
        // Assign a default or placeholder email
        email: `no-email-${userProfile.userId}@example.com`,
        deliveryAddress: "",
        premiereLevel: 0,
      });
      await newUser.save();
      console.log("New User:", newUser);

      // Redirect to frontend with new user information
      // res.redirect(`${process.env.REACT_APP_SERVER_URL}/`);
      res.redirect(`${process.env.REACT_APP_URL}/home?userId=${newUser.lineUserId}&displayName=${newUser.displayName}&pictureUrl=${newUser.pictureUrl}&email=${newUser.email}`);
    }
  } catch (error) {
    console.error('Error exchanging code for token or fetching profile:', error.response ? error.response.data : error.message);
    res.status(500).send('Authentication failed. Error: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
  }
});



// Update user info
router.put('/user/:id', async (req, res) => {
  console.log("Update USER INFO:", req.body);
  const { displayName, email, deliveryAddress, lineUserId } = req.body;
  console.log("Receive user info:", displayName, email, deliveryAddress, lineUserId);

  try {
    const updatedUser = await User.findOneAndUpdate(
      { lineUserId },
      { displayName, email, deliveryAddress },
      { new: true }
    );

    if (!updatedUser) {
      console.log("User Not found!")
      return res.status(404).json({ message: 'User not found' });
    } else {
      console.log("Successfully Update User:", updatedUser);
      res.json(updatedUser); // Send updated user back to the client
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


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


// Get all seller's related products
router.get('/products/get_all', async (req, res) => {
  try {
    console.log("Search all products by", req.query.username);
    const products = await Product.find({ lineUserId: req.query.username });
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

// Get all seller's related orders
router.get('/orders/get_all', async (req, res) => {
  try {
    console.log("Search all orders by", req.query.username);
    const orders = await Order.find({ productOwnerID: req.query.username });
    if (!orders.length) {
      console.log('No orders found for this user');
    } else {
      console.log('Find', orders.length, "orders!");
    }
    res.json(orders);
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
  console.log("Create New Order with", req.body);
  
  const { userId, productId, productName, productPrice, quantity, totalAmount } = req.body;

  try {
    // Find the product by productId
    const prd = await Product.findOne({ productId: productId });
    if (!prd) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productOwnerID = prd.lineUserId;
    
    // Find the buyer by userId
    const buyer = await User.findOne({ lineUserId: userId });
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    const buyerName = buyer.displayName;
    const buyerContact = buyer.email;

    console.log("productId:", productId);
    console.log("productOwnerID:", productOwnerID);

    // Check if there is sufficient stock for the requested quantity
    if (quantity <= prd.quantity) {
      // Create a new order
      const newOrder = new Order({
        orderId: uuidv4(),
        buyerId: userId,
        buyerName: buyerName,
        buyerContact: buyerContact,
        productId: productId,
        productName: productName,
        productPrice: productPrice,
        productOwnerID: productOwnerID,
        quantity: quantity,
        totalAmount: totalAmount,
      });

      // Update product quantity
      prd.quantity -= quantity;
      await prd.save();

      try {
        await newOrder.save();
        return res.status(201).json(newOrder);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    } else {
      // Return an error if the purchase quantity exceeds the available stock
      return res.status(400).json({ message: 'Purchase quantity exceeds available stock' });
    }

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: 'Server error' });
  }
});


// Endpoint to get orders by userId
router.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const orders = await Order.find({ buyerId: userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete an order and restore the product quantity
router.delete('/orders/delete/:id', async (req, res) => {
  try {
    console.log("Deleting order id:", req.params.id);
    
    // Find and delete the order by orderId
    const deletedOrder = await Order.findOneAndDelete({ orderId: req.params.id });
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log("Order deleted:", req.params.id);

    // Find the product associated with the deleted order
    const prd = await Product.findOne({ productId: deletedOrder.productId });
    if (!prd) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Restore the product's quantity based on the deleted order's quantity
    prd.quantity += deletedOrder.quantity;
    await prd.save();

    console.log("Product quantity restored for productId:", deletedOrder.productId);
    
    res.json({ message: 'Order deleted and product quantity restored' });
    
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: err.message });
  }
});


// Calculation of fertilizer
router.post('/calculate', (req, res) => {
  
  const data = req.body;
  console.log("Calculate Data:", data);

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


// Get XLSX data
router.get('/get-faq', (req, res) => {
  try {
      // Specify the path to the Excel file
      console.log("Getting Frequent Questions");
      const filePath = path.join(__dirname, '../xlsx/qa_0804.xlsx');
      
      // Read the Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON format
      const faqData = XLSX.utils.sheet_to_json(worksheet);

      // Send the FAQ data as JSON response
      res.json(faqData);
  } catch (error) {
      console.error('Error reading Excel file:', error);
      res.status(500).json({ message: 'Failed to load FAQ data' });
  }
});


// Seller Register route
router.post('/seller/register', async (req, res) => {
  const { name, username, password, email, phoneNumber } = req.body;

  try {
    // Check if user already exists
    const existingSeller = await Seller.findOne({ username });
    if (existingSeller) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new seller
    const newSeller = new Seller({
      name: name,
      username: username,
      password: hashedPassword,
      email: email,
      phoneNumber: phoneNumber,
      submit: "已訂閱",
    });
    console.log("Successfully register a new seller:", newSeller);
    await newSeller.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering seller:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seller Login route
router.post('/seller/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the seller by username
    const seller = await Seller.findOne({ username });
    if (!seller) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: seller._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log("Seller successfully log in:", req.body);
    // Send back seller info and token
    res.json({
      message: 'Login successful',
      token,
      seller: {
        name: seller.name,
        username: seller.username,
        email: seller.email,
        phoneNumber: seller.phoneNumber,
        submit: seller.submit,
      }
    });
  } catch (error) {
    console.error('Error logging in seller:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Seller update profile
router.put('/seller/:username', async (req, res) => {
  const { username } = req.params;
  const { name, email, phoneNumber } = req.body;

  try {
    const updatedSeller = await Seller.findOneAndUpdate(
      { username },
      { name, email, phoneNumber },
      { new: true } // Return the updated document
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.status(200).json(updatedSeller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// POST: Place a fertilizer order
router.post('/fertilizer', async (req, res) => {
  const { username, order_time, fertilizer_amount, olivine_amount, total_amount } = req.body;

  // Validate input
  if (!username || !fertilizer_amount || !olivine_amount || !total_amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newFertilizer = new Fertilizer({
      username,
      order_time,
      fertilizer_amount,
      olivine_amount,
      total_amount,
    });

    await newFertilizer.save();
    res.status(201).json({ message: 'Fertilizer placed successfully', fertilizer: newFertilizer });
  } catch (error) {
    console.error('Error placing fertilizer:', error);
    res.status(500).json({ message: 'Error placing fertilizer', error });
  }
});


// GET: Retrieve order history for a seller
router.get('/fertilizer/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const orders = await Fertilizer.find({ username }).sort({ order_time: -1 });  // Fetch orders, sorted by time
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Error fetching order history', error });
  }
});

// Delete the fertilizer order
router.delete('/fertilizer/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFertilizer = await Fertilizer.findByIdAndDelete(id);
    if (!deletedFertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }
    console.log('Fertilizer deleted successfully');
    res.status(200).json({ message: 'Fertilizer deleted successfully' });
  } catch (error) {
    console.error('Error deleting fertilizer:', error);
    res.status(500).json({ message: 'Error deleting fertilizer', error });
  }
});

module.exports = router;
