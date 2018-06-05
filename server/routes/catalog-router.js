var express = require('express');
var azureBlobsController = require('../controllers/azureBlobsController');
var azureFilesController = require('../controllers/azureFilesController');
var router = express.Router();

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage});

router.get('/', function(req, res) {
    
    //var az = new azureStorage();
    var x = new azureFilesController().getFullCatalog();
    x.then(x => res.json(x));
})

router.get('/*', function(req, res) {
    //var az = new azureStorage();
    var x = new azureFilesController().getFullCatalog(req.path);
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

router.post('/upload/*', upload.single('file'), function(req, res) {
    if(req.file && req.file.originalname) {
        var x = new azureFilesController().uploadFile(req.path, req.file);
        x.then(() => new azureFilesController().getFullCatalog(req.path).then(result => res.json(result)))
    }
    
})

router.post('/lookups', function(req, res) {
    var pathname = req.body.filePath;
    //validate the pathname, then
    new azureFilesController().getFileLink(pathname).then(result => res.json({fileUrl: result}))
        .catch(function(error) {
            console.log(error);
        });
    
})

module.exports = router;
