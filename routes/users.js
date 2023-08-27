var express = require('express');
var router = express.Router();
var app = require('./../app.js');
const db = require('./../scripts/dbController.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
    res.render('pages/register', { title: 'Express'}); 
});

router.get('/login', function(req, res, next) {
    res.render('pages/login');
});

router.post('/login', express.urlencoded({extended: false}), function(req, res, next) {
    
    // Regenerate session
    req.session.regenerate(function (err) {
        if (err) { next(err); }

        req.session.user = req.body.user;
        
        // Save then redirect
        req.session.save(function(err) {
            if (err) { return next(err); }
            console.log(`Got information: `, req.body);
            res.redirect('/');
        })
    });
    
});

router.post('/register', async (req, res) =>{
    try{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const passwordSanity = req.body.passwordConfirm;

        // Check to make sure the user actually submitted everything
        if(!username || !email || !password || !passwordSanity) {
            return res.render('pages/register', {error: 'Not all fields are filled!'});
        } else if (!(password === passwordSanity)) {
            return res.render('pages/register', {error: 'Passwords are not equal! \n How did this happen?'});
        }
        console.log(Object.keys(await db.getUserByEmail(email)));
        console.log(Object.keys(await db.getUserByEmail(email)).length);
        if (Object.keys(await db.getUserByEmail(email)).length >= 1) {
            return res.render('pages/register', {error: "Email already exists!"});
        }
        else if (Object.keys(await db.getIdFromUsername(username)).length >= 1) {
            return res.render('pages/register', {error: "Username already exists!"});
        }
        // Okay so at this point everything should be 100% good
        const user =  await db.insertUser(username, email, password);
        user.id = await db.getIdFromUsername(username);
        req.session.userId = user.id;
        console.log(req.body);
        console.log(req.session);
        return res.redirect('/');
    }
    catch(e){
        console.log(e);
        res.sendStatus(400);
    }
});

router.get('/logout', function(req, res, next) {
    req.session.user = null;
    req.session.save(function (err) {
        if (err) { next(err) }
        
        req.session.regenerate(function(err) {
            if(err) { next(err) }
            res.redirect('/');
        })
    })
});

function isAuthenticated(req, res, next) {
    if (req.session.user) { next(); } 
    else { next('route'); }
}

module.exports = router;
