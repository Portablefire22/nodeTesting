var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
    res.render('pages/register', { title: 'Express'}); 
});

router.post('/', function(req, res, next) {
    console.log(`Got information:`, req.body);
    res.sendStatus(200);
});

module.exports = router;
