var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('pages/projects', {
        projectInfo: projectInformation.getInfo()
    });
});

router.get('/Site', function(req, res, next){
    res.render('pages/projects/thisSite', {projectInformation: getJson('../public/projects/thissite/thissite.json')});
});

router.get('/computercraft', function(req, res, next){
    res.render('pages/projects/computer', {projectInformation: getJson('../public/projects/computercraft/computercraft.json')});
});

function getJson(jsonPath) {
    var pathProj = path.join(__dirname, jsonPath) 
    return JSON.parse(fs.readFileSync(pathProj, 'utf-8'));
}

module.exports = router;
