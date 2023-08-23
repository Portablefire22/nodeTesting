var express = require('express');
var router = express.Router();
var projectInformation = require('../scripts/projectInformation.js');

/* GET home page. */
router.get('/', function(req, res, next) { 
    res.render('pages/index', { title: 'Express' });
});

router.get('/about', function(req, res, next){
    res.render('pages/about', { title: 'Express'});
});

router.get('/projects', function(req, res, next){
    res.render('pages/projects', { title: 'Express'});
});

router.get('/projects/Site', function(req, res, next){
    res.render('pages/projects/thisSite', {
        title: 'Express'});

});
module.exports = router;
