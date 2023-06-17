const { getAllHomes } = require('../managers/houseManager');

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

module.exports = router;