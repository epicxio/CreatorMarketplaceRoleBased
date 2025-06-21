import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
  addPermission,
  removePermission
} from '../controllers/roleController';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

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
  body('permissions.*.resource')
    .trim()
    .notEmpty()
    .withMessage('Resource name is required for each permission'),
  body('permissions.*.actions')
    .isArray()
    .withMessage('Actions must be an array')
    .notEmpty()
    .withMessage('At least one action is required'),
];

const permissionValidation = [
  body('resource')
    .trim()
    .notEmpty()
    .withMessage('Resource name is required'),
  body('actions')
    .isArray()
    .withMessage('Actions must be an array')
    .notEmpty()
    .withMessage('At least one action is required'),
];

// Convert async route handlers to match Express types
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Routes
router.post('/', roleValidation, validateRequest, asyncHandler(createRole));
router.get('/', asyncHandler(getRoles));
router.get('/:id', asyncHandler(getRole));
router.put('/:id', roleValidation, validateRequest, asyncHandler(updateRole));
router.delete('/:id', asyncHandler(deleteRole));
router.post('/:id/permissions', permissionValidation, validateRequest, asyncHandler(addPermission));
router.delete('/:id/permissions', asyncHandler(removePermission));

export default router; 