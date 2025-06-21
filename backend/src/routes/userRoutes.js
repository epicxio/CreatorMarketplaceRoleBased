const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getUsers,
  getCreators,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  getUserStats,
} = require('../controllers/userController');

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const userValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('userType').notEmpty().withMessage('User type is required'),
];

const passwordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// User Routes
router.get('/', getUsers);
router.get('/creators', getCreators);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);
router.post('/', userValidation, passwordValidation, validateRequest, createUser);
router.put('/:id', userValidation, validateRequest, updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/reset-password', resetPassword);

module.exports = router; 