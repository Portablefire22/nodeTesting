var express = require('express');
var router = express.Router();
var app = require('./../app.js');
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
