import express from 'express';
import roleRoutes from './roleRoutes';

const router = express.Router();

// Register routes
router.use('/roles', roleRoutes);

export default router; 