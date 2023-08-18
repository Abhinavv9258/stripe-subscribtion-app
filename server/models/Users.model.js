const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = mongoose.Schema({
    name: {
        type: 'string',
        required: true,
        trim:true
    },
    email: {
        type: 'string',
        required: true,
        unique:true
    },
    password: {
        type: 'string',
        required: true,
        minlength:7,
    },
    tokens:[
        {
            token: {
                type: 'string',
                required: true    
            }
        }
    ],
    subscriptionEnrolled:[
        {   
            planId: {
                // type: mongoose.Schema.Types.ObjectId,
                type:'string'
                // ref: 'subscription'
            },
            sessionId: {
                type: 'string',
                required: true
            },
            enrolledAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
})

// we are hashing the password
schema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
});

// assign methods to schema
// token generate
schema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id: this._id}, process.env.SECRET_KEY, {
            expiresIn: "1d"
        });
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    }catch(error){
        console.log("Token generating error : ", error);
        res.status(500).json(error);
    }
}

const Users = mongoose.model('Users',schema);
module.exports = Users;
