const User = require('../models/User');
const { hashPassword } = require('../utils/hashPassword');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    if (user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // For now, just return role and success (no JWT/session)
    return res.json({ message: 'Login successful', role: user.role });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 