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

function deleteHomeById(homeId){
    return House.findByIdAndDelete(homeId);
}

function editHomeById(homeId,name,type,year,city,homeImage,description,availablePieces){
    const home ={
        name,
        type,
        year,
        city,
        homeImage,
        description,
        availablePieces,
    };

    return House.findByIdAndUpdate(homeId,home,{runValidators:true});
}

function rentHome(home,homeId,userId){
    const alreadyRented = checkIfUserAlreadyRented(home,userId);
    if(alreadyRented){
       throw new Error('You already rented this place!'); 
    }
    return House.findByIdAndUpdate(homeId,{$push:{rentedHome:userId},$inc:{availablePieces:-1}});
}

function checkIfUserAlreadyRented(home,userId){
    return home.rentedHome.map(h=>h._id.toString()).includes(userId);
}

module.exports ={
    getAllHomes,
    createHome,
    getHomeById,
    deleteHomeById,
    editHomeById,
    rentHome,
    checkIfUserAlreadyRented,
}