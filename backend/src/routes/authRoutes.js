const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route for Super Admin and Admin
router.post('/login', authController.login);

module.exports = router; 