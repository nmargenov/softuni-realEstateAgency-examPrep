const router = require('express').Router();

router.get('/catalog',async(req,res)=>{
    try{
        res.status(302).render('houses/catalog');
    }catch(err){
        res.status(404).render('404');
    }
});

module.exports = router;