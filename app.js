require("dotenv").config();
require('newrelic');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("./config/passport");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const jwt = require("jsonwebtoken");

var Usuario = require("./models/usuario");
var Token = require("./models/token");

var indexRouter = require('./routes/index');
var bicicletasRouter = require('./routes/bicicletas');
var usuariosRouter = require('./routes/usuarios');
var tokenRouter = require('./routes/token');

var bicicletasApiRouter = require('./routes/api/bicicletas');
var mailerApiRouter = require('./routes/api/mailer');
var authApiRouter = require('./routes/api/auth');

let store;
if (process.env.NODE_ENV === 'development'){
  store = new session.MemoryStore;
} else {
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });
  store.on('error', function(error){
    assert.ifError(error);
    assert.ok(false);
  });
}

var app = express();
app.set('secretKey', 'jwt_pwd_!!223344');
app.use(session({
  cookie: { maxAge: 240 * 60 * 60 * 1000 },
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_bicis_!*'
}));

const mongoose = require('mongoose');
const { RequestTimeout } = require('http-errors');
const { decode } = require('punycode');

var mongoDb = process.env.MONGO_URI;

mongoose.connect(mongoDb, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/login", function (req, res) {
  res.render("session/login", {});
});

app.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, usuario, info) {
    if (err) return next(err);
    if (!usuario) return res.render("session/login", info);
    req.logIn(usuario, function (err) {
      if (err) return next(err);
      console.log("autenticado");
      return res.redirect("/");
    });
  })(req, res, next);
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/forgotPassword", function (req, res) {
  res.render("session/forgotPassword", {});
});

app.post("/forgotPassword", function (req, res) {
  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    if (!usuario) {
      res.render("session/resetPassword", { message: 'Usuario no encontrado, por favor verifique' });
      return
    }

    usuario.resetPassword(function (err) {
      if (err) return next(err);
      console.log("session/forgotPasswordMessage");
    });

    res.render('session/forgotPasswordMessage')
  });
});

app.get("/forgotPasswordMessage", function (req, res) {
  res.render("session/forgotPasswordMessage", {});
});

app.get("/resetPassword", function (req, res) {
  res.render("session/resetPassword", {});
});

app.get("/resetPassword/:token", function (req, res) {
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token) {
      res.status(400).send({
        type: 'not-verified',
        msg: 'Token no existe'
      });
    }

    Usuario.findById(token._userID, function (err, usuario) {
      if (!usuario) {
        res.status(400).send({
          type: 'not-verified',
          msg: 'Usuario no existe'
        });
      }

      res.render("session/resetPassword", { user: usuario });
    });
  });
});

app.post("/resetPassword", function (req, res) {
  if (req.body.password != req.body.confirmPassword) {
    res.render("session/resetPassword", { message: 'Contraseñas no coinciden' });
    return
  }
  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    usuario.password = req.body.password;
    usuario.save(function (err) {
      if (err) {
        res.render("session/resetPassword", { message: err.errors });
      } else {
        res.redirect("/login");
      }
    });
  });
});

app.use('/', indexRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);

app.use('/api/bicicletas', validarUSuario, bicicletasApiRouter);
app.use('/api/mailer', mailerApiRouter);
app.use('/api/auth', authApiRouter);
app.use("/privacy_policy", function(req, res) {
  res.sendFile("public/privacy_policy.html");
});
app.use("/google941206d3004754a1", function(req, res) {
  res.sendFile("public/google941206d3004754a1.html");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [
    'profile', 'email' ] }
    //'https://www.googleapis.com/auth/plus.login',
    //'https://www.googleapis.com/auth/plus.profile.emails.read'] } 
  )
);

app.get('/auth/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/error'
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    console.log("Usuario sin autenticarse");
    res.redirect("/login");
  }
}

function validarUSuario(req, res, next) {
  jwt.verify(req.header("x-access-token"), req.app.get('secretKey'), function (err, decoded) {
    if (err) {
      console.error(err);
      res.json({ status: "error", message: err.message, data: null });
    } else {
      req.body.userId = decoded.id;
      console.log("jwt verify:" + decoded);
      next();
    }
  });
}

module.exports = app;
