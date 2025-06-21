require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const brandRoutes = require('./routes/brandRoutes');
const roleRoutes = require('./routes/roleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const userRoutes = require('./routes/userRoutes');
const userTypeRoutes = require('./routes/userTypeRoutes');

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
app.use('/api/users', userRoutes);
app.use('/api/user-types', userTypeRoutes);

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

// Role management routes
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 

