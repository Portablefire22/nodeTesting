var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectRouter = require('./routes/projects');

var app = express();

// Is it best to store secrets in a json file?
// lets find out
var secretsJson = JSON.parse(fs.readFileSync(`secrets.json`, 'utf-8'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
console.log(`${path.join(__dirname + '/public')}`);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectRouter);

// Session shit

app.use(sessions({
    secret
}))




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message);
  // render the error page
  res.status(err.status || 500);
  res.render('error', {
        errorStatus: (err.status || 500),
        errorMessage: err.message,
    });
});

module.exports = app;
