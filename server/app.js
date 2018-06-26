var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog-router');
var registerRouter = require('./routes/register');
var authRouter = require('./routes/auth');
var app = express();

// view engine setup
// app.set('views', path.join(__dirname, '/views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// authorization session setup via express-session
app.use(session({
  name: 'newknowledgefileshare',
  cookie: { maxAge: 600000 },
  store: new SQLiteStore({
    dir: path.join(__dirname, '..', 'data/db'),
    db: 'development.sqlite',
    table: 'sessions'
  }),
  saveUninitialized: false,
  resave: true,
  secret: 'secret'
}));

app.use(function(req, resp, next) {
  if (req.cookies.newknowledgefileshare && !req.session.currentUser) {
    resp.clearCookie('newknowledgefileshare');
  }
  next();
})

app.use(function(req, resp, next) {
  resp.setHeader('X-Frame-Options', 'DENY');
  resp.setHeader('Access-Control-Allow-Origin', process.env.WEBSITE_HOSTNAME || 'http://localhost:3000');
  resp.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
})

app.use(function(req, res, next) {
  res.locals.currentUser = req.session.currentUser || null;
  next();
})


app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);
app.use('/auth', authRouter);
app.use('/register', registerRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
