var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config.js'); // if it is in same directory, put ./
var mongoose = require('mongoose');
var User = require('./app/models/user');
var Story = require('./app/models/story')
var jsonwebtoken = require('jsonwebtoken');

var app = express(); // It's the object to run the server
var secretKey = config.secretKey;

mongoose.connect(config.database, function(err){
	if(err) {
		console.log("database connect error:" + err);
	} else {
		console.log("connect to db");
	}
})

app.use(bodyParser.urlencoded({ extended : true })); // if we give it as false, it can only parse string
app.use(bodyParser.json());
app.use(morgan('dev')); // logs in terminal

app.use(express.static(__dirname + '/public')); // any file (css, html, js) will be render under public folder

var api = require('./app/routes/api')(app, express); // we need to put app and express here because we use app, express when export api or they will be treated as local variable
app.use('/api', api); // '/api' is the prefix of api, use to test

app.get('*', function(req, res) { // * means any route you go to, response this file.So no matter what URL, it goes to same page
    res.sendFile(__dirname + '/public/app/view/index.html');
});

app.listen(config.port, function (err) {
	if(err) {
		console.log(err);
	} else {
		console.log("listening on port 5000")
	}
})