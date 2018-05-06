var express = require('express');
var azureStorage = require('./azure-storage-router');
var router = express.Router();

router.get('/', function(req, res, next) {
    
    var az = new azureStorage();
    var x = az.getFullCatalog();
    res.send(x);
    

})

module.exports = router;
