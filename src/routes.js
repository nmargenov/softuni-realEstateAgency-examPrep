const router = require('express').Router();

const homeController = require("./controllers/homeController");
const userController = require("./controllers/userController");
const houseController = require("./controllers/houseController");

router.use(homeController);
router.use(userController);
router.use('/houses',houseController);

router.get('*',(req,res)=>{
    res.status(404).render('404');
})

module.exports = router;