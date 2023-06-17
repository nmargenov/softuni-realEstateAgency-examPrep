const { getLatestThreeHomes } = require('../managers/houseManager');

const router = require('express').Router();

router.get(['/','/index'],async(req,res)=>{
    try{
        const homes = await getLatestThreeHomes().lean();
        const hasHomes = homes.length>0;
        res.status(302).render('home',{homes,hasHomes});
    }catch(err){
        res.status(404).render('404');
    }
});

module.exports = router;