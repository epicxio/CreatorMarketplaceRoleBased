require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Role = require('../src/models/Role');

const MONGO_URI = process.env.MONGODB_URI;

const roleScreenMapping = {
  'Super Admin': ['Dashboard', 'User Management', 'Settings', 'Analytics', 'Content Moderation'],
  'Admin': ['Dashboard', 'User Management', 'Settings'],
  'Creator': ['Dashboard', 'My Content', 'Analytics'],
  'Brand': ['Dashboard', 'Campaigns', 'Analytics'],
  'Agency': ['Dashboard', 'Clients', 'Campaigns'],
  'Account Manager': ['Dashboard', 'Assigned Clients', 'Reports'],
  'Student': ['Dashboard', 'My Courses'],
  'Teacher': ['Dashboard', 'My Classes', 'Grading'],
  'Parent': ['Dashboard', 'My Children'],
  'Employee': ['Dashboard', 'My Tasks'],
  'Department Head': ['Dashboard', 'Department View'],
  'HRBP': ['Dashboard', 'Employee Management'],
};

async function migrate() {
  await mongoose.connect(MONGO_URI);

  const users = await User.find({ $or: [{ assignedScreens: { $exists: false } }, { assignedScreens: { $size: 0 } }] }).populate('role');
  let updated = 0;

  for (const user of users) {
    const roleName = user.role && user.role.name ? user.role.name : null;
    const assignedScreens = roleScreenMapping[roleName] || ['Dashboard'];
    user.assignedScreens = assignedScreens;
    await user.save();
    updated++;
    console.log(`Updated user ${user.email} with screens: ${assignedScreens.join(', ')}`);
  }

  console.log(`Migration complete! Updated ${updated} users.`);
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
}); 