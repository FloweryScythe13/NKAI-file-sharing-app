function isAuthenticated(req) {
  if (!req) return false; // 'No Request';
  if (!req.session) return false // 'No Session';
  if (!req.session.currentUser) return false // 'Not Authenticated';
  return true;
}

function login(req, user) {
  req.session.currentUser = user.get({plain: true}); 
}

function logout(req) {
  req.session.currentUser = null;
}

function bounceOutIfLoggedOut(req, res, callback, fallbackPath = '/') {
  if (isAuthenticated(req)) {
    return callback();
  } else {
    res.sendStatus(401);
  }
}

module.exports = {
  isAuthenticated,
  bounceOutIfLoggedOut,
  login,
  logout
}