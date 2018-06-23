var express = require('express');
var router = express.Router();
const Db = require('../db').instance;
const { logout, login } = require('../utils/auth');
var debug = require('debug')('strawbank:auth');

const User = Db.models.user;

router.post('/login', function(req, res, next) {
  let { username, password } = req.body;
  User.findByCredentials({ username, password })
    .then((user) => {
      login(req, user);
      return user;
    })
    .then((user) => {
      res.send('status OK, login request succeeded')
    })
    .catch((err) => {
      debug(err);
    });
});

router.post('/logout', function(req, res) {
  logout(req);
  res.end();
})

module.exports = router;
