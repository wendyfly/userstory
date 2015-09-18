var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config.js');
var mongoose = require('mongoose');
var app = express(); // It's the object to run the server

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

var api = require('./app/routes/api')(app, express);
app.use('/api', api); // '/api' is the prefix of api


app.get('*', function(req, res) { // * means any route you go to, response this file
    res.sendFile(__dirname + '/public/view/index.html');
});

app.listen(config.port, function (err) {
	if(err) {
		console.log(err);
	} else {
		console.log("listening on port 5000")
	}
})