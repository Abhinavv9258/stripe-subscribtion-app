const mongoose = require('mongoose');
require('dotenv').config();
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

// here change database name from myBlogs to E-Learn
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.uabdmj8.mongodb.net/stripe-subscription-app?retryWrites=true&w=majority`;

const connexion = mongoose.connect(uri, connectionParams)
.then(() => console.log('Connection established with database..!!'))
.catch((error) => console.log('Error while connecting to database..!!',error));

module.exports =  connexion