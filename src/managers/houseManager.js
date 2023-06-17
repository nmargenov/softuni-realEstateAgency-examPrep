const House = require("../models/House");

function getAllHomes(){
    return House.find();
}

function createHome(name,type,year,city,homeImage,description,availablePieces,owner){
    const home = {
        name,
        type,
        year,
        city,
        homeImage,
        description,
        availablePieces,
        owner
    };

    return House.create(home);
}

function getHomeById(homeId){
    return House.findById(homeId).populate('rentedHome');
}

module.exports ={
    getAllHomes,
    createHome,
    getHomeById,
}