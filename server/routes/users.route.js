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
    
    try{
        const { email } = req.body;
        const userData = await userModel.findOne({ email:email });
        if (userData) {
            return res.status(422).json({ status:422 ,error: "User already exist, try different email!" });
        }
        const data = new userModel(user);
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

            if(!isMatch){
                res.status(400).json({status:400,error: "User not found, please register."});
            } else {
                res.status(201).json({ status:201,message: "User Signed in successfully."});
            }
        }else{
            res.status(400).json({status:400, error: "Credentials not found. Please register!"});
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