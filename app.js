var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./scripts/dbController.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectRouter = require('./routes/projects');

var app = express();

// SQL connection
const mysql = require('mariadb');

const mysqlStore = require('express-mysql-session')(session);

const options ={
    connectionLimit: 1,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    createDatabaseTable: true
}

const pool = mysql.createPool(options);
app.use(cookieParser());
const  sessionStore = new mysqlStore(options);app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())

const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
        maxAge: oneDay,
        sameSite: true,
        secure: process.env.NODE_ENV === "production"
    }
}))

app.use(async function(req,res,next){
    try {
        if (!(typeof(req.session.userId) === 'undefined')){
            console.log(req.session.userId);
            console.log(await db.getUserById(req.session.userId[0].id));
            res.locals.user = {username: (await db.getUserById(req.session.userId[0].id))[0].username}; 
        } else {
            res.locals.user = {username: null};
        }
    }
    catch(e) {
        console.log(e);
    }
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
console.log(`${path.join(__dirname + '/public')}`);

// Session stuff
//
// Reading list:
// https://rrawat.com/blog/sessions-vs-tokens-authentication
// https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectRouter);


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


module.exports =  app ;
