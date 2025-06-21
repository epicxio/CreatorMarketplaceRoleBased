const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
  getUserTypes,
} = require('../controllers/roleController');

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules
const roleValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ min: 3 })
    .withMessage('Role name must be at least 3 characters long'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('permissions')
    .isArray()
    .withMessage('Permissions must be an array')
    .optional(),
  body('permissions.*')
    .isMongoId()
    .withMessage('Each permission must be a valid MongoDB ObjectId'),
];

// Routes
router.get('/user-types', getUserTypes);
router.post('/', roleValidation, validateRequest, createRole);
router.get('/', getRoles);
router.get('/:id', getRole);
router.put('/:id', roleValidation, validateRequest, updateRole);
router.delete('/:id', deleteRole);

module.exports = router; 