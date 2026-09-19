const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbStore = require('../models/dbStore');
const { JWT_SECRET } = require('../middleware/authMiddleware');

function register(req, res) {
  try {
    const { name, email, phone, password, role, responderType, organization, serviceArea } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = dbStore.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = `usr-${Date.now()}`;
    const userRole = role || 'Citizen';

    const newUser = {
      id: userId,
      name,
      email,
      phone: phone || '',
      passwordHash,
      role: userRole,
      responderType: responderType || null,
      organization: organization || null,
      serviceArea: serviceArea || null,
      createdAt: new Date().toISOString()
    };

    dbStore.data.users.push(newUser);

    // If registered as Responder, also create entry in responders pool
    if (userRole === 'Responder') {
      const respId = `resp-${Date.now()}`;
      dbStore.data.responders.push({
        id: respId,
        userId: userId,
        name: `${name} (${responderType || 'Unit'})`,
        type: responderType || 'Ambulance',
        organization: organization || 'Emergency Response',
        latitude: 12.9716,
        longitude: 77.5946,
        availability: 'Available',
        currentWorkload: 0,
        contact: phone || '',
        serviceArea: serviceArea || 'Citywide'
      });
    }

    dbStore.save();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userWithoutPass } = newUser;
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userWithoutPass
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
}

function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = dbStore.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPass = bcrypt.compareSync(password, user.passwordHash);
    if (!validPass) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userWithoutPass } = user;
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPass
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
}

function getMe(req, res) {
  try {
    const user = dbStore.data.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { passwordHash: _, ...userWithoutPass } = user;
    res.json({ user: userWithoutPass });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
}

module.exports = {
  register,
  login,
  getMe
};
