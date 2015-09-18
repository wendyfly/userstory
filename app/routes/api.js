var User = require('../models/user');

var config = require('../../config');

var secreKey = config.secreKey;

module.exports = function(app, express) {
    var api = express.Router();

    api.post('/signup', function(req, res){
        var user = new User({
            name: req.body.name, // body is body-parse,
            username: req.body.username,
            password: req.body.password
        });

        user.save(function(err) {
            if(err) {
                res.send(err);
                return;
            }

            res.json({message: "user has been created"});
        });
    });



    return api;
}