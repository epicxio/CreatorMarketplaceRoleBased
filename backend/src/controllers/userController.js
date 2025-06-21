const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Get all users with optional filtering
const getUsers = async (req, res) => {
  try {
    const { userType, status, search } = req.query;
    let query = {};
    
    // Filter by user type
    if (userType && userType !== 'all') {
      query['userType'] = userType;
    }
    
    // Filter by status
    if (status && status !== 'all') {
      query['status'] = status;
    }
    
    // Search functionality
    if (search) {
      query['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { creatorId: { $regex: search, $options: 'i' } },
        { 'socialMedia.instagram': { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query).populate('userType', 'name icon color');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get creators specifically
const getCreators = async (req, res) => {
  try {
    const creators = await User.getCreators().populate('userType', 'name icon color');
    res.json(creators);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching creators', error: error.message });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('userType');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { 
    name, 
    email, 
    password, 
    userType, 
    organization, 
    department, 
    status,
    // Creator-specific fields
    bio,
    socialMedia,
    // Brand-specific fields
    companyName,
    industry,
    website,
    // Common fields
    phoneNumber,
    address
  } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      passwordHash,
      userType,
      organization,
      department,
      status,
      bio,
      socialMedia,
      companyName,
      industry,
      website,
      phoneNumber,
      address
    });

    const savedUser = await newUser.save();
    const populatedUser = await User.findById(savedUser._id).populate('userType');
    res.status(201).json(populatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      userType, 
      organization, 
      department, 
      status,
      bio,
      socialMedia,
      companyName,
      industry,
      website,
      phoneNumber,
      address
    } = req.body;
    
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (userType !== undefined) user.userType = userType;
    if (organization !== undefined) user.organization = organization;
    if (department !== undefined) user.department = department;
    if (status !== undefined) user.status = status;
    if (bio !== undefined) user.bio = bio;
    if (socialMedia !== undefined) user.socialMedia = socialMedia;
    if (companyName !== undefined) user.companyName = companyName;
    if (industry !== undefined) user.industry = industry;
    if (website !== undefined) user.website = website;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (address !== undefined) user.address = address;

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate('userType');
    res.json(populatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete a user (soft delete)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'deleted';
    await user.save();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Reset user password
const resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a secure temporary password
    const temporaryPassword = crypto.randomBytes(8).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(temporaryPassword, salt);

    user.passwordHash = passwordHash;
    user.passwordResetRequired = true;
    user.temporaryPassword = temporaryPassword; // For testing only

    await user.save();
    
    res.json({ 
      message: 'Password has been reset successfully. A temporary password has been generated.',
      temporaryPassword: temporaryPassword // For testing only. Remove in production.
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $lookup: {
          from: 'usertypes',
          localField: 'userType',
          foreignField: '_id',
          as: 'userTypeInfo'
        }
      },
      {
        $group: {
          _id: '$userTypeInfo.name',
          count: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
            }
          },
          inactive: {
            $sum: {
              $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0]
            }
          }
        }
      }
    ]);
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user statistics', error: error.message });
  }
};

module.exports = {
  getUsers,
  getCreators,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  getUserStats,
}; 