import path from 'path';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import brandRoutes from './routes/brandRoutes';
import roleRoutes from './routes/roleRoutes';
import permissionRoutes from './routes/permissionRoutes';
import userRoutes from './routes/userRoutes';
import userTypeRoutes from './routes/userTypeRoutes';
import creatorRoutes from './routes/creatorRoutes';
import instagramAuth from './routes/instagramAuth';
import authRoutes from './routes/authRoutes';
import { syncPermissions } from './services/permissionSeeder';

const dotEnvPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: dotEnvPath });

console.log(`--- Server attempting to load .env file from: ${dotEnvPath} ---`);
console.log(`--- MONGODB_URI loaded: ${process.env.MONGODB_URI ? '******' : 'NOT FOUND'} ---`);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined.');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .catch(err => console.error('Initial MongoDB connection error:', err));

app.use('/api/brands', brandRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-types', userTypeRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/auth/instagram', instagramAuth);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Creator Marketplace API' });
});

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    syncPermissions();
  });
});

mongoose.connection.on('error', (err: any) => {
  console.error('MongoDB connection error:', err);
}); 