var User = require('../models/user');  // we will manipulate User, so we need to import

var config = require('../../config');  // we need config file, because we need secrekey to later login method

var secreKey = config.secretKey;




module.exports = function(app, express) {
    var api = express(); // inorder to have api, we need to call express.router firstly
    api.post('/signup', function(req, res){
        var user = new User({
            name: req.params.name, // body is body-parse,
            username: req.params.username,
            password: req.params.password
        });
        console.log("body" + req.params);
        console.log("name" + req.params.name);

        user.save(function(err) {
            if(err) {
                res.send(err);
                return;
            }

            res.json({message: 'user has been created'});
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

    return api;
}
