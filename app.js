var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const DB = require("./services/sc_mongodb")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

DB.connectDB()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.post("/send-mqtt", function(req, res) {
    mqttClient.sendMessage(req.body.message);
    res.status(200).send("Message sent to mqtt");
  });

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
