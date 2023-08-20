var express = require('express');
var router = express.Router();

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
module.exports = router;
