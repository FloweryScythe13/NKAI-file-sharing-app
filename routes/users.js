var express = require('express');
var azureStorage = require('./azure-storage-router');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  var az = new azureStorage();
  az.runFileServiceUpload();
  res.send('respond with a resource');
});

module.exports = router;
