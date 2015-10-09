var User = require('../models/user');  // we will manipulate User, so we need to import

var Story = require('../models/story');

var config = require('../../config');  // we need config file, because we need secrekey to later login method

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

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

module.exports = function(app, express) {
    var api = express.Router(); // inorder to have api, we need to call express.router firstly
    api.post('/signup', function(req, res){
        var user = new User({
            name: req.body.name, // body is body-parse,
            username: req.body.username,
            password: req.body.password
        });
        var token = createToken(user);
        console.log("body is " + req.body);
        console.log("name is " + req.body.name);

        user.save(function(err) {
            if(err) {
                res.send(err);
                return;
            }

            res.json({
            success: true,
            message: "user has been created",
            token: token
            });
        });
    });
    api.get('/users', function(req, res) {
        User.find({}, function(err, users){
            if(err) {
                res.send(err);
                return;
            }
            res.json(users);
        })
    })

    api.post('/login', function(req, res) {
            User.findOne({    // find specific user object
                username: req.body.username
            }).select('name username password').exec(function(err, user) {
                if(err) throw err;
                if(!user) {
                    res.send({message: "User doesn't exist"})
                } else if (user) {
                    var validPassword = user.comparePassword(req.body.password);
                    if(!validPassword) {
                        res.send({message: "Invalid password"});
                    } else {
                        // create token
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
    api.use(function(req, res, next){
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

    /*api.get('/', function(req, res) {
        res.json("Hello world");
    });*/

    api.route('/')
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


    api.get('/me', function(req, res) {
        res.json(req.decoded); // when we want to get decode, we cannot use middleware,so we use this to fetch login user data
    })

    return api;
}
