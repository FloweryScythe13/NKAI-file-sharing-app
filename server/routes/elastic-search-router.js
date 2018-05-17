var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client( {
    hosts: [
        'http://localhost:3000/'
    ]
});

router.get('/health', function(req, res) {
    client.cluster.health({}, function(err, resp, status) {
        if (err) {
            console.log("Client Health ERROR -- ", err);
        }
        else {
            console.log("Client Health --", resp);
            res.send({resp});
        }
    })
});

router.get('/createIndex', function(req, res) {
    client.indices.create({
        index: 'imageMap'
    }, function(err, resp, status) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("create", resp);
            res.send({resp});
        }
    });
});

module.exports = router;