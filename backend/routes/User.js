const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Worker = require('../models/worker');
const bcrypt = require('bcrypt');

// [GET] /user — get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users); // was 201 → changed to 200 (GET = OK)
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/new', async (req, res) => {
  try {
    const { username, email, role, mobilePhone, fullName, password } = req.body;

    if (!username || !email || !role || !mobilePhone || !fullName || !password) {
      return res.status(400).json({ message: 'Field tidak boleh kosong' });
    }

    const existingUsername = await User.findOne({ username : username });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username sudah terdaftar' });
    }

    const existingEmail = await User.findOne({email :  email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    const existingPhone = await User.findOne({ mobilePhone : mobilePhone });
    if (existingPhone) {
      return res.status(409).json({ message: 'Nomor HP sudah terdaftar' });
    }

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
    return res.status(201).json({ message: 'Success', user: newUser });

  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const tempUser = req.body.input;
    const tempPassword = req.body.password;

    const query = isNaN(tempUser)
      ? { $or: [{ username: tempUser }, { email: tempUser }] }
      : { mobilePhone: tempUser };

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
      return res.status(404).json({ message: 'Username/email/phone not found' });
    }

    return res.status(200).json({
      message: 'Login successful',
      role: role
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.put('/update/:username', async (req, res) => {
  try {
    const { email, mobilePhone, fullName, password } = req.body;
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

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
