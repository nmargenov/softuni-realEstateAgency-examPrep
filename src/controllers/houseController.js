const { getAllHomes, createHome } = require('../managers/houseManager');
const { mustBeAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelper');

const router = require('express').Router();

router.get('/catalog',async(req,res)=>{
    try{
        const homes = await getAllHomes().lean();
        const hasHomes = homes.length>0;
        res.status(302).render('houses/catalog',{homes,hasHomes});
    }catch(err){
        res.status(404).render('404');
    }
});

router.get('/create',mustBeAuth,(req,res)=>{
    res.status(302).render('houses/create');
});

router.post('/create',mustBeAuth,async(req,res)=>{
    const name = req.body.name?.trim();
    const type = req.body.type?.trim();
    const year = req.body.year;
    const city = req.body.city?.trim();
    const homeImage = req.body.homeImage?.trim();
    const description = req.body.description?.trim();
    const availablePieces = req.body.availablePieces;
    const owner = req.user._id;

    try{
        await createHome(name,type,year,city,homeImage,description,availablePieces,owner);
        res.redirect('/houses/catalog');
    }catch(err){
        const error = getErrorMessage(err);
        res.status(400).render('houses/create',{error,name,type,year,city,homeImage,description,availablePieces});
    }
});

module.exports = router;