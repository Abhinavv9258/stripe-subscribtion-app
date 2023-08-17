const express = require("express");
const userModel = require("../models/Users.model");
const userRoute = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register API
userRoute.post('/register',async(req,res)=>{
    const user = req.body;
    const data = new userModel(user);
    if(!user.fname || !user.lname || !user.email || !user.username || !user.password || !user.phone || !user.address || !user.stream){
        return res.status(422).json({error: "Please fill all the fields properly."});
    }          
    const { email, username } = req.body;
    const userData = await userModel.find({ email, username });
    if (userData.length) {
        return res.status(403).json({ message: "User Already Present!" });
    }
    try{
        await data.save();
        res.json(data);
        res.status(201).json({ message: "User Registered Successfully." });
    }catch(error){
        res.status(500).send(error);
    }
});

// Login API route
userRoute.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const findUser = await userModel.findOne({ username });
        // if (!user || password !== user.passwordHash) {
        //   return res.status(401).json({ error: 'Invalid credentials' });
        // }
        if (!findUser || password !== findUser.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate a random session ID using crypto
        const sessionId = crypto.randomBytes(16).toString('hex');
        // Store the generated session ID in the user document
        findUser.sessionId = sessionId;
        await findUser.save();
        // Send the session ID in the response
        // res.json({ sessionId: sessionId });
        alert('Successfully saved session ',username);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

userRoute.get('/all',async(req,res)=>{
    try{
        const userInfo = await userModel.find({});
        res.json(userInfo);
    }catch(error){
        res.status(500).send(error);
    }
})


module.exports = { userRoute };