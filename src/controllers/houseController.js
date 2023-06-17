const { getAllHomes, createHome, getHomeById, deleteHomeById, editHomeById, rentHome, checkIfUserAlreadyRented } = require('../managers/houseManager');
const { mustBeAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelper');

const router = require('express').Router();

router.get('/catalog', async (req, res) => {
    try {
        const homes = await getAllHomes().lean();
        const hasHomes = homes.length > 0;
        res.status(302).render('houses/catalog', { homes, hasHomes });
    } catch (err) {
        res.status(404).render('404');
    }
});

router.get('/create', mustBeAuth, (req, res) => {
    res.status(302).render('houses/create');
});

router.post('/create', mustBeAuth, async (req, res) => {
    const name = req.body.name?.trim();
    const type = req.body.type?.trim();
    const year = req.body.year;
    const city = req.body.city?.trim();
    const homeImage = req.body.homeImage?.trim();
    const description = req.body.description?.trim();
    const availablePieces = req.body.availablePieces;
    const owner = req.user._id;

    try {
        await createHome(name, type, year, city, homeImage, description, availablePieces, owner);
        res.redirect('/houses/catalog');
    } catch (err) {
        const error = getErrorMessage(err);
        res.status(400).render('houses/create', { error, name, type, year, city, homeImage, description, availablePieces });
    }
});

router.get('/:homeId/details', async (req, res) => {
    try {
        const homeId = req.params.homeId;
        const home = await getHomeById(homeId).lean();
        if (!home) {
            throw new Error("Invalid home!");
        }
        const isLogged = req.user?._id;
        const isOwner = home.owner == isLogged;

        const rentedHome = home.rentedHome.map(h => h.name).join(', ');
        const hasRentals = home.rentedHome.length > 0;

        const availablePieces = home.availablePieces
        const hasAvailablePieces = availablePieces > 0;

        const hasRented = isLogged && checkIfUserAlreadyRented(home,isLogged);
        res.status(302).render('houses/details', { home, isLogged, isOwner, rentedHome, availablePieces, hasAvailablePieces, hasRentals, hasRented });
    } catch (err) {
        res.status(404).render('404');
    }
});

router.get('/:homeId/delete', mustBeAuth, async (req, res) => {
    try {
        const homeId = req.params.homeId;
        const home = await getHomeById(homeId);
        const loggedUser = req.user._id;
        if (home.owner != loggedUser) {
            throw new Error('Access denied!');
        }
        await deleteHomeById(homeId);
        res.redirect('/houses/catalog');
    } catch (err) {
        res.status(404).render('404');
    }
});

router.get('/:homeId/edit', mustBeAuth, async (req, res) => {
    try {
        const homeId = req.params.homeId;
        const home = await getHomeById(homeId).lean();
        const loggedUser = req.user._id;
        if (!home || home.owner != loggedUser) {
            throw new Error('Access denied!');
        }
        res.status(302).render('houses/edit',{home});
    } catch (err) {
        res.status(404).render('404');
    }
});

router.post('/:homeId/edit',mustBeAuth,async (req,res)=>{
    const name = req.body.name?.trim();
    const type = req.body.type?.trim();
    const year = req.body.year;
    const city = req.body.city?.trim();
    const homeImage = req.body.homeImage?.trim();
    const description = req.body.description?.trim();
    const availablePieces = req.body.availablePieces;

    const home = {name, type, year, city, homeImage, description, availablePieces};

    try{
        const homeId = req.params.homeId;
        const home = await getHomeById(homeId).lean();
        const loggedUser = req.user._id;
        if (!home || home.owner != loggedUser) {
            throw new Error('Access denied!');
        }
        await editHomeById(homeId,name,type,year,city,homeImage,description,availablePieces);
        res.redirect(`/houses/${homeId}/details`);
    }catch(err){
        const error = getErrorMessage(err);
        res.status(400).render('houses/edit',{error,home});
    }
});

router.get('/:homeId/rent', mustBeAuth, async (req, res) => {
    try {
        const homeId = req.params.homeId;
        const home = await getHomeById(homeId).lean();
        const loggedUser = req.user._id;
        if (!home || home.owner == loggedUser) {
            throw new Error('Access denied!');
        }
        if(home.availablePieces<=0){
            throw new Error("No available pieces!");
        }
        await rentHome(home,homeId,loggedUser);
        res.redirect(`/houses/${homeId}/details`);
    } catch (err) {
        res.status(404).render('404');
    }
});

router.get('/search',mustBeAuth,async(req,res)=>{
    try{
        const search = req.query.search;
        const searchToLower = search?.trim().toLowerCase();

        let homes = await getAllHomes().lean();
        if(search){
            homes = homes.filter(h=>h.type.toLowerCase().includes(searchToLower));
        }
        const hasHomes = homes.length>0;
        res.status(302).render('houses/search',{homes,hasHomes,search});
    }catch(err){
        res.status(404).render('404');
    }
});
module.exports = router;