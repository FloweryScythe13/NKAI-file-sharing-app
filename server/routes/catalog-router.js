var express = require('express');
var azureStorage = require('./azure-storage-router');
var router = express.Router();

router.get('/', function(req, res) {
    
    var az = new azureStorage();
    var x = az.getFullCatalog();
    x.then(function(output) {
        res.json({output});
    })
    
    

})

router.get('/*', function(req, res) {
    var az = new azureStorage();
    var x = az.getFullCatalog(req.path);
    x.then(function(output) {
        console.log(output);
        res.render('catalog', { title: decodeURI(req.path), body: JSON.stringify(output) });
    })
})

module.exports = router;
