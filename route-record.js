const conf = require('./config');

module.exports = function(app) {
    app.post('/' + conf.token + '/record/:name/:key', function (req, res) {
        res.send('hello world')
    })
};
