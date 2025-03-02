const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Worker = require('../models/worker');

router.get('/', async (req, res)=>{
  const users = await User.find();
  res.status(201).json(users)
});

router.post('/new', async (req, res)=>{
    try {
      
      const { username, email, role, mobilePhone, fullName , password } = req.body;

      const newUser = new User({
        username,
        email,
        role,
        mobilePhone,
        fullName,
        password
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
    const query = isNaN(tempUser) ? {$or: [{username : tempUser}, {email : tempUser}]} : {mobilePhone : tempUser};
    const user = await User.findOne(query);
    const worker = await Worker.findOne(query);
    let role = 0;
    if (!user) {
      if(!worker){
        return res.status(404).json({ message: 'Username or email or password not found' });
      }else{
        role = worker.role
        if (worker.password !== tempPassword) {
          return res.status(401).json({ message: 'Incorrect password' });
        } 
      }
    }else{
      role = user.role
      if (user.password !== tempPassword) {
        return res.status(401).json({ message: 'Incorrect password'});
      }  
    }
    
    return res.status(200).json({ 
      message: 'Login successful', 
      role : role
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;