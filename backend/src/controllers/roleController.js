const Role = require('../models/Role');

const userTypes = ['employee', 'creator', 'brand', 'accountmanager', 'admin', 'superadmin'];

const getUserTypes = async (req, res) => {
    try {
        res.status(200).json(userTypes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user types', error: error.message });
    }
};

const createRole = async (req, res) => {
  try {
    const { name, description, permissions, userTypes, assignedUsers } = req.body;
    const role = new Role({
      name,
      description,
      permissions,
      userTypes,
      assignedUsers
    });
    await role.save();
    const newRole = await Role.findById(role._id).populate('permissions');
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true }).populate('permissions');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate('permissions');
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { name, description, permissions, userTypes, assignedUsers } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description, permissions, userTypes, assignedUsers },
      { new: true, runValidators: true }
    ).populate('permissions');
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    role.isActive = false;
    await role.save();
    
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
  getUserTypes,
}; 