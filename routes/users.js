var express = require('express');
var router = express.Router();
var app = require('./../app.js');
const db = require('./../scripts/dbController.js');
const bcrypt = require('bcrypt');

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

router.post('/login', express.urlencoded({extended: false}), async function(req, res, next) {
   

    // OKAY lets add authentication because rn you can just log into anything with just the username
    //
    // If passwords are equal
    const user = (await db.getUserByName(req.body.username))[0];

    if (typeof(user) === 'undefined') {
        return res.render('pages/login', {error:"User not found!"});
    }

    if (await bcrypt.compare(req.body.password, user.password)) {

    } else {
        res.render('pages/login', {error:"Username and password do not match!"});
    }

    // Regenerate session
    req.session.regenerate(async function (err) {
        if (err) { next(err); }
        req.session.userId = (await db.getUserByName(req.body.username))[0].id;
                // Save then redirect
        req.session.save(function(err) {
            if (err) { return next(err); }
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

        if (Object.keys(await db.getUserByEmail(email)).length >= 1) {
            return res.render('pages/register', {error: "Email already exists!"});
        }
        else if (Object.keys(await db.getIdFromUsername(username)).length >= 1) {
            return res.render('pages/register', {error: "Username already exists!"});
        }
        // Okay so at this point everything should be 100% good
        const finishedPassword = await bcrypt.hash(password, 10);

        const user =  await db.insertUser(username, email, finishedPassword);
        user.id = await db.getIdFromUsername(username);
        req.session.userId = user.id;

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

function comparePassword(plaintextPassword, hash) {
    bcrypt.compare(plaintextPassword, hash)
      .then(result => {
        return result
    })
    .catch(err => {
        console.log(err)
    })
}


module.exports = router;
