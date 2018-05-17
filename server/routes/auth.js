var express = require('express');
var router = express.Router();
const Db = require('../db').instance;
const { logout, login } = require('../utils/auth');
//var debug = require('debug')('strawbank:auth');

const User = Db.models.user;

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'New Knowledge File Explorer: Login' });
});

router.post('/login', function(req, res, next) {
  let { username, password } = req.body;
  User.findByCredentials({ username, password })
    .then((user) => {
      login(req, user);
      return user;
    })
    .then((user) => {
      req.session.sessionFlash = {
        type: 'success',
        message: `Thanks for logging in ${user.username}!`
      }
      res.redirect(301, '/index');
    })
    .catch((err) => {
//      debug(err);
      req.session.sessionFlash = {
        type: 'danger',
        message: 'There was a problem with your credentials'
      }
      res.render('login', { title: 'New Knowledge File Explorer: Login' });
    });
});

router.post('/logout', function(req, res, next) {
  logout(req);
  req.session.sessionFlash = {
    type: 'success',
    message: 'You have been logged out'
  }
  res.redirect(307, '/');
})

module.exports = router;
