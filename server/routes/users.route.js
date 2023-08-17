const express = require("express");
const userModel = require("../models/Users.model");
const userRoute = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')

// Register API : for user registration
userRoute.post('/register', async (req, res) => {
    try {
        const user = req.body;
        if (!user.name || !user.email || !user.password) {
            return res.status(422).json({ error: "Please fill all the fields properly." });
        }
        const { email } = req.body;
        const userData = await userModel.findOne({ email: email });
        if (userData) {
            return res.status(422).json({ status: 422, error: "User already exist, try different email!" });
        }
        const data = new userModel(user);
        await data.save();
        res.status(201).json({ status: 201, message: "User Registered Successfully." });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Login API : for user login
userRoute.post('/login', async (req, res) => {

    let token;
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Please fill the data." });
    }

    try {
        const findUser = await userModel.findOne({ email: email });
        if (findUser) {
            const isMatch = await bcrypt.compare(password, findUser.password);

            if (!isMatch) {
                res.status(422).json({ status: 422, error: "Entered wrong password or email, please try again." });
            } else {
                // token generate
                token = await findUser.generateAuthToken();

                // cookie generate
                res.cookie("userCookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: true
                });

                const result = {
                    findUser,
                    token
                }

                res.status(201).json({ status: 201, result, message: "User Signed in successfully." });
            }
        } else {
            res.status(400).json({ status: 400, error: "Credentials not found. Please register!" });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Validate API : for user validation
userRoute.get('/validate', auth, async (req, res) => {
    try{
        const validUser = await userModel.findOne({_id: req.userId});
        res.status(201).json({status:201, ValidUserOne: validUser});
    } catch (error) {    
        console.error('Error during validation:', error);
        res.status(500).json({ status:500, error: 'Internal server error' });
    }
});

// Logout API  
userRoute.get('/logout', auth, async (req, res) => {
    try{
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("userCookie",{path:"/"});
        req.rootUser.save();
        res.status(201).json({status:201});
        console.log("done");
    }catch(error){
        console.error('Error during logout :', error);
        res.status(500).json({ status: 500, error: 'Internal server error' });
    }
})


module.exports = { userRoute };