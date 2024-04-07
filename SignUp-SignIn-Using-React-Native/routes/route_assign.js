const express = require('express');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const { jwtkey } = require('../keys');
const User = require('../models/User'); // Correct the path to your User model file
const Userdetail=require("../models/userdetails");
const router = express.Router();
const tokenget=require('../middleware/tokenget')
const cookieParser=require("cookie-parser");
router.use(cookieParser())
router.post('/signup',async (req, res) => {
    

    const { email, password } = req.body;

    try {
        const user = new User({ email, password }); // Use the User model to create a new user
        await user.save();
        const token = jwt.sign({ userId: user._id },jwtkey); // Create a new token with the user id
        res.cookie('token', token, { httpOnly: true });
        res.send({ token });
        
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
            res.status(422).send('Email is already registered');
        } else {
            res.status(422).send(err.message);
        }
    }
    
   
});
router.post('/add-details', tokenget, async (req, res) => {
    const { email,mobilenumber, name, age } = req.body;
    const userId = req.user._id; // Authenticated admin ID from tokenget middleware

    try {
        const userdetail = new Userdetail({ name,email,mobilenumber, age, belongsto: userId });
        await userdetail.save();
        res.send(userdetail);
    } catch (err) {
        res.send(err)
    }
});

router.put('/modify-details/:id', tokenget, async (req, res) => {
    const { email,mobilenumber, name, age } = req.body;
    const adminId = req.user._id; // Authenticated admin ID from tokenget middleware
    const detailId = req.params.id; // Detail ID to modify

    try {
        const userdetail = await Userdetail.findOneAndUpdate({ _id: detailId, belongsto: adminId }, { mobilenumber,age,name }, { new: true });
        if (!userdetail) {
            return res.status(404).send('Details not found');
        }
        res.send(userdetail);
    } catch (err) {
        res.status(500).send('Error modifying details');
    }
});
router.get('/show-details', tokenget, async (req, res) => {
    const detailId = req.params.id; // Detail ID to show

    try {
        const userdetail = await Userdetail.findOne({ belongsto: req.user._id });
        if (!userdetail) {
            return res.status(404).send('Details not found');
        }
        res.send(userdetail);
    } catch (err) {
        res.status(500).send('Error fetching details');
    }
});


router.delete('/delete-details/:id', tokenget, async (req, res) => {
    const adminId = req.user._id; // Authenticated admin ID from tokenget middleware
    const detailId = req.params.id; // Detail ID to delete

    try {
        const userdetail = await Userdetail.findOneAndDelete({ _id: detailId, belongsto: adminId });
        if (!userdetail) {
            return res.status(404).send('Details not found');
        }
        res.send(userdetail);
    } catch (err) {
        res.status(500).send('Error deleting details');
    }
});


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).send('Must provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send('Invalid email or password');
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, jwtkey);
        res.cookie('token', token, { httpOnly: true });
        res.send({ token });
    } catch (err) {
        res.status(404).send('Invalid email or password');
    }
});

module.exports = router;
