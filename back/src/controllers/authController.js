const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({ user });

  } catch (error) {

    return res.status(400).send({ error: 'Registration failed' });

  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email }).select('+password');

  if (!user) return res.status(400).send({ error: 'User not found' });

  if (!await bcrypt.compare(password, user.password))
    return res.status(400).send({ error: 'invalid password' });

  user.password = undefined;

  res.send({ user });
  
});

module.exports = app => app.use('/auth', router);
