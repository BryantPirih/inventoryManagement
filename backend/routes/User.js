const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Worker = require('../models/worker');
const bcrypt = require('bcrypt');

router.get('/', async (req, res)=>{
  const users = await User.find();
  res.status(201).json(users)
});

router.post('/new', async (req, res)=>{
    try {
      const { username, email, role, mobilePhone, fullName , password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        role,
        mobilePhone,
        fullName,
        password: hashedPassword
      });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/login', async (req, res) => {
  try {
    const tempUser = req.body.input;
    const tempPassword = req.body.password;
    const query = isNaN(tempUser) ? { $or: [{ username: tempUser }, { email: tempUser }] } : { mobilePhone: tempUser };

    const user = await User.findOne(query);
    const worker = await Worker.findOne(query);
    let role = 0;

    if (user) {
      const isMatch = await bcrypt.compare(tempPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
      role = user.role;
    } else if (worker) {
      const isMatch = await bcrypt.compare(tempPassword, worker.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
      role = worker.role;
    } else {
      return res.status(404).json({ message: 'Username or email or password not found' });
    }

    return res.status(200).json({
      message: 'Login successful',
      role: role
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.put('/update/:username', async (req, res) => {
  const { email, mobilePhone, fullName, password } = req.body;

  try {
    const update = {};

    if (email) update.email = email;
    if (mobilePhone) update.mobilePhone = mobilePhone;
    if (fullName) update.fullName = fullName;
    if (password && password !== '') {
      const hashed = await bcrypt.hash(password, 10);
      update.password = hashed;
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      { $set: update },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;