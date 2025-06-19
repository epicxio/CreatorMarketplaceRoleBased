require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const brandRoutes = require('./routes/brandRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/brands', brandRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Creator Marketplace API' });
});

const creatorRoutes = require('./routes/creatorRoutes');
app.use('/api/creators', creatorRoutes);

const instagramAuth = require('./routes/instagramAuth');
app.use('/auth/instagram', instagramAuth);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 

