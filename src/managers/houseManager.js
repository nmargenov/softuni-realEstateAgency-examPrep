const House = require("../models/House");

function getAllHomes(){
    return House.find();
}

module.exports ={
    getAllHomes,
}