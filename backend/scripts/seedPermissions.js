require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Permission = require('../src/models/Permission');

const resources = [
  'User',
  'Role',
  'Content',
  'Campaign',
  'Brand',
  'Creator',
  'Analytics',
  'Roles & Permissions',
  'User Types',
  'Permission Management',
  'Access Control',
  'Audit Logs',
  'Dashboard',
];

const actions = ['View', 'Create', 'Edit', 'Delete'];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedPermissions = async () => {
  await connectDB();
  try {
    await Permission.deleteMany({});
    console.log('Old permissions deleted.');

    const permissions = [];
    for (const resource of resources) {
      for (const action of actions) {
        permissions.push({
          resource,
          action,
          name: `${resource}:${action}`,
        });
      }
    }

    await Permission.insertMany(permissions);
    console.log(`${permissions.length} permissions have been seeded successfully.`);
  } catch (error) {
    console.error('Error seeding permissions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

seedPermissions(); 