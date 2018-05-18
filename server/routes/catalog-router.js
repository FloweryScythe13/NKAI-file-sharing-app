var express = require('express');
var azureBlobsController = require('../controllers/azureBlobsController');
var router = express.Router();

router.get('/', function(req, res) {
    
    //var az = new azureStorage();
    var x = new azureBlobsController().getBlobCatalog()
    x.then(x => res.json(x));
})

router.get('/*', function(req, res) {
    //var az = new azureStorage();
    var x = new azureBlobsController().getBlobCatalog(req.path);
    x.then(x => res.json(x));
})

// router.get('/*', function(req, res) {
//     var az = new azureStorage();
//     var x = az.getFullCatalog(req.path);
//     x.then(function(output) {
//         console.log(output);
//         res.render('catalog', { title: decodeURI(req.path), body: JSON.stringify(output) });
//     })
// })

module.exports = router;
