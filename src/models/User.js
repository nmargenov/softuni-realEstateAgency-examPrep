const mongoose = require('mongoose');

const nameRegex = /^[A-Za-z]+ [A-Za-z]+$/;

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required!'],
        minLength:[5,'Username must be atleast 5 characters long!']
    },
    name:{
        type:String,
        required:[true,'Name is required!'],
        validate: {
            validator: function(value) {
              return nameRegex.test(value);
            },
            message: 'Invalid name format! Please provide a valid firstname lastname.'
          }
    },
    password:{
        type:String,
        required:[true,'Password is required!']
    }
});

const User = mongoose.model('User',userSchema);

module.exports = User;