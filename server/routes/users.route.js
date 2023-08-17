const express = require("express");
const userModel = require("../models/Users.model");
const userRoute = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Register API : for user registration
userRoute.post('/register',async(req,res)=>{
    const user = req.body;
    if(!user.name || !user.email || !user.password){
        return res.status(422).json({error: "Please fill all the fields properly."});
    }
    const { email } = req.body;
    const userData = await userModel.findOne({ email:email });
    if (userData) {
        return res.status(422).json({ error: "User already exist, try different email!" });
    }
    
    try{
        const data = new userModel(user);
        // const data = new userModel(user.name, user.email, user.password);

        // password hashing function
        await data.save();
        res.json(data);
        res.status(201).json({ message: "User Registered Successfully." });
    }catch(error){
        res.status(500).send(error);
    }
});


// Login API : for user login
userRoute.post('/login', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;
        if( !email || !password ) {
            res.status(400).json({error:"Please fill the data."});
        }
        
        const findUser = await userModel.findOne({ email:email });
        if (findUser) {
            const isMatch = await bcrypt.compare(password, findUser.password);
        
            token = await findUser.generateAuthToken();
            console.log(token);
            
            console.log('Successfully saved session ',email);
            if(!isMatch){
                res.status(400).json({error: "Invalid Credentials."});
            } else {
                res.json({ message: "User Signed in successfully"});
            }
        }else{
            res.status(400).json({error: "Invalid Credentials."});
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Route for fetching user data
userRoute.get('/:userId', async (req, res) => {
    try{
        const user = await userModel.findById(req.params.userId);
        res.json(user);
    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = { userRoute };