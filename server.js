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

function createToken(user) {
   var token = jsonwebtoken.sign({
        id:user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresInMinute : 1440
    });
    return token;
}

app.post('/api/signup', function(req, res){
        var user = new User({
            name: req.body.name, // body is body-parse,
            username: req.body.username,
            password: req.body.password
        });
        console.log("body is " + req.body);
        console.log("name is " + req.body.name);

        user.save(function(err) {
            if(err) {
                res.send(err);
                return;
            }

            res.json({message: 'user has been created'});
        });
});

app.get('/api/users', function(req, res) {
        User.find({}, function(err, users){
            if(err) {
                res.send(err);
                return;
            }
            res.json(users);
        })
    })

app.post('/api/login', function(req, res) {
        User.findOne({    // find specific user object
            username: req.body.username
        }).select('password').exec(function(err, user) {
            if(err) throw err;
            if(!user) {
                res.send({message: "User doesn't exist"})
            } else if (user) {
                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword) {
                    res.send({message: "Invalid password"});
                } else {
                    //// create token
                    var token = createToken(user);
                    res.json({
                        success: true,
                        message: "successfully login ",
                        token: token
                    });
                }
            }
        });
});

// create a middleware to check whether token is valid
app.use(function(req, res, next){
    console.log("some body just came to our app");
    var token = req.body.token || req.param('token') || req.headers['x-access-token'] // three ways to get a token. It depends on where u store the token
    // check if token exist
    if(token) {
        jsonwebtoken.verify(token, secretKey, function(err, decode){
            if(err) {
                res.status(403).send({success: false, message: "Failed to authenticate user"})
            } else {
                req.decoded = decode;

                next();
            }
        })
    } else {
        res.status(403).send({success: false, message: "No token provided"})
    }

})

// Destination B // provide a legitimate token// direct u to homepage

/*app.get('/', function(req, res) {
    res.json("Hello world");
});*/

app.route('/')
    . post(function(req, res) {
        var story = new Story({
            creator: req.decoded.id,
            content: req.body.content,

        });
        story.save(function(err) {
            if(err) {
                res.send(err);
                return;
            }
            res.json({message: "New Story Created"});
        })
    })

    .get(function(req, res) {
        Story.find({creator: req.decoded.id}, function(err, stories) {
            if(err) {
                res.send(err);
                return;
            }
            res.json(stories);
        })
    })
//var api = require('./app/routes/api')(app, express); // we need to put app and express here because we use app, express when export api or they will be treated as local variable
//app.use('/api', api); // '/api' is the prefix of api, use to test


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