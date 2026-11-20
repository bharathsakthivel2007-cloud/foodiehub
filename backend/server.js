// server.js - College Mini Project Backend
// Simple Express server with JSON file storage & Static Frontend Serving

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// middlewares
app.use(cors());
app.use(express.json());

// file path helper
const foodsFilePath = path.join(__dirname, 'foods.json');
const ordersFilePath = path.join(__dirname, 'orders.json');

// Serve static frontend files (allows running full stack directly on http://localhost:5000)
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '..')));

// -------------------------------------------------------------
// BACKEND API ENDPOINTS
// -------------------------------------------------------------

// API 1: GET /api/foods - get all food items from foods.json
app.get('/api/foods', (req, res) => {
  console.log('[GET] /api/foods request vanthruku');
  try {
    const data = fs.readFileSync(foodsFilePath, 'utf8');
    const foods = JSON.parse(data);
    res.json(foods);
  } catch (err) {
    console.log('Error reading foods file:', err);
    res.status(500).json({ error: 'Failed to read foods data' });
  }
});

// API 2: POST /api/login - customer login validation
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('[POST] /api/login - Email:', email);

  // login check pannrom
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  // extract name before @
  const username = email.split('@')[0];
  res.json({
    success: true,
    name: username,
    message: 'Login successful'
  });
});

// API 2B: POST /api/admin/login - separate admin login validation
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  console.log('[POST] /api/admin/login - Admin Username:', username);

  // admin credentials check: username 'admin' and password 'admin123'
  if (username === 'admin' && password === 'admin123') {
    return res.json({
      success: true,
      role: 'admin',
      name: 'Administrator',
      message: 'Admin login successful'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid Admin credentials'
  });
});

// API 3: POST /api/orders - save new customer order into orders.json
app.post('/api/orders', (req, res) => {
  const { custName, phone, address, pincode, payment, cart, total, deliveryFee, grandTotal } = req.body;
  console.log('[POST] /api/orders - New order for:', custName, 'Phone:', phone);

  if (!custName || !phone || !address) {
    return res.status(400).json({ success: false, message: 'Missing required details' });
  }

  // generate random order id like ORD4582
  const orderId = 'ORD' + Math.floor(1000 + Math.random() * 9000);

  const newOrder = {
    orderId,
    custName,
    phone,
    address,
    pincode,
    payment,
    cart,
    total,
    deliveryFee,
    grandTotal,
    status: 'Pending',
    date: new Date().toLocaleString()
  };

  try {
    // read existing orders
    let orders = [];
    if (fs.existsSync(ordersFilePath)) {
      const fileData = fs.readFileSync(ordersFilePath, 'utf8');
      if (fileData.trim().length > 0) {
        orders = JSON.parse(fileData);
      }
    }

    // append new order and save back to orders.json
    orders.push(newOrder);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');

    console.log('Order saved successfully! Order ID:', orderId);
    res.json({ success: true, orderId: orderId, order: newOrder });
  } catch (err) {
    console.log('Error saving order:', err);
    res.status(500).json({ success: false, message: 'Could not save order' });
  }
});

// API 4: GET /api/orders - view all orders (for admin / viva demo)
app.get('/api/orders', (req, res) => {
  console.log('[GET] /api/orders request');
  try {
    if (!fs.existsSync(ordersFilePath)) {
      return res.json([]);
    }
    const data = fs.readFileSync(ordersFilePath, 'utf8');
    const orders = data.trim().length > 0 ? JSON.parse(data) : [];
    res.json(orders);
  } catch (err) {
    console.log('Error reading orders:', err);
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

// API 5: POST /api/orders/status - update order status (admin action)
app.post('/api/orders/status', (req, res) => {
  const { orderId, status } = req.body;
  console.log('[POST] /api/orders/status - Order:', orderId, 'Status:', status);

  try {
    if (!fs.existsSync(ordersFilePath)) {
      return res.status(404).json({ success: false, message: 'No orders found' });
    }

    const fileData = fs.readFileSync(ordersFilePath, 'utf8');
    let orders = fileData.trim().length > 0 ? JSON.parse(fileData) : [];

    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    orders[orderIndex].status = status;
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');

    res.json({ success: true, message: 'Order status updated', order: orders[orderIndex] });
  } catch (err) {
    console.log('Error updating order status:', err);
    res.status(500).json({ success: false, message: 'Could not update order status' });
  }
});

// Fallback route: serve index.html if user opens http://localhost:5000 in browser
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const frontendIndex = path.join(__dirname, '../frontend/index.html');
  const rootIndex = path.join(__dirname, '../index.html');
  if (fs.existsSync(frontendIndex)) {
    return res.sendFile(frontendIndex);
  } else if (fs.existsSync(rootIndex)) {
    return res.sendFile(rootIndex);
  }
  res.send('Foodie Backend Server running on port ' + PORT);
});

// start server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`Foodie Full Stack Server running at: http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} directly in your browser!`);
  console.log('====================================================');
});
