const mongoose = require('mongoose');
const homeImageRegex = /^https?:\/\//;

const houseSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required!'],
        minLength:[6,'Name must be at least 6 characters long!']
    },
    type:{
        type:String,
        enum:{
            values:['Apartament','Villa','House'],
            message:"Invalid housing type! 'Apartament', 'Villa' and 'House' are only acceptable!"
        },
    },
    year:{
        type:Number,
        required:[true,'Year is required!'],
        min:[1850,'Year must be between 1850 and 2021!'],
        max:[2021,'Year must be between 1850 and 2021!'],
    },
    city:{
        type:String,
        required:[true,'City is required!'],
        minLength:[4,'City must be at least 4 characters long!']
    },
    homeImage:{
        type:String,
        required:[true,'Home image is required!'],
        validate:{
            validator: function(value){
                return homeImageRegex.test(value);
            },
            message:'Invalid home image URL!'
        }
    },
    description:{
        type:String,
        required:[true,'Description is required!'],
        maxLength:[60,'Description must be up to 60 characters long!'],
    },
    availablePieces:{
        type:Number,
        required:[true,'Available pieces are required!'],
        min:[0,'Available peaces must be a positive number from 0 to 10!'],
        max:[10,'Available peaces must be a positive number from 0 to 10!'],
    },
    rentedHome:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const House = mongoose.model('House',houseSchema);

module.exports = House;