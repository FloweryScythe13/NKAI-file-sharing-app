var express = require('express');
var azureBlobsController = require('../controllers/azureBlobsController');
var azureFilesController = require('../controllers/azureFilesController');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage});

var { bounceOutIfLoggedOut } = require('../utils/auth');

router.get('/', function(req, res) {
    bounceOutIfLoggedOut(req, res, function() {
        //var az = new azureStorage();
        var x = new azureFilesController().getFullCatalog();
        x.then(x => res.json(x));
    })   
})

router.get('/*', function(req, res) {
    bounceOutIfLoggedOut(req, res, function() {
        //var az = new azureStorage();
        var x = new azureFilesController().getFullCatalog(req.path);
        x.then(x => res.json(x));
    })  
})

// router.get('/*', function(req, res) {
//     var az = new azureStorage();
//     var x = az.getFullCatalog(req.path);
//     x.then(function(output) {
//         console.log(output);
//         res.render('catalog', { title: decodeURI(req.path), body: JSON.stringify(output) });
//     })
// })

router.post('/upload/*', upload.single('file'), function(req, res) {
    bounceOutIfLoggedOut(req, res, function() {
        if(req.file && req.file.originalname) {
            var x = new azureFilesController().uploadFile(req.params[0], req.file);
            x.then(() => new azureFilesController().getFullCatalog(req.params.dir).then(result => res.json(result)))
        }
    })      
})

router.post('/lookups', function(req, res) {
    bounceOutIfLoggedOut(req, res, function() {
        var pathname = req.body.filePath;
        //validate the pathname, then
        new azureFilesController().getFileLink(pathname).then(result => res.json({fileUrl: result}))
            .catch(function(error) {
                console.log(error);
            });
    })   
})

router.post('/downloads', function(req, res) {
    bounceOutIfLoggedOut(req, res, function() {
        var pathname = req.body.fileUrl;

        var serverFile = new azureFilesController().getFileDownload(pathname);
        fs.createReadStream(serverFile)
    })   
})

module.exports = router;
