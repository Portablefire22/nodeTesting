var express = require('express');
const fs = require('fs');
var router = express.Router();
var projectInformation = require('./../scripts/projectInformation.js');
var path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) { 
    res.render('pages/index', { title: 'Express' });
});

router.get('/about', function(req, res, next){
    res.render('pages/about', { title: 'Express'});
});



module.exports = router;
