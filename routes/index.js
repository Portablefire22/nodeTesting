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

router.get('/projects', function(req, res, next){
    res.render('pages/projects', {
        projectInfo: projectInformation.getInfo()
    });
});

router.get('/projects/Site', function(req, res, next){
    res.render('pages/projects/thisSite', {projectInformation: getJson('../public/projects/thissite/thissite.json')});
});

router.get('/projects/computercraft', function(req, res, next){
    res.render('pages/projects/computer', {projectInformation: getJson('../public/projects/computercraft/computercraft.json')});
});

function getJson(jsonPath) {
    var pathProj = path.join(__dirname, jsonPath) 
    return JSON.parse(fs.readFileSync(pathProj, 'utf-8'));
}

module.exports = router;
