const serveIndex = require('serve-index');
const conf = require('./config');

module.exports = function ({express, app}) {
    app.use(
        '/' + conf.token + '/explore',
        express.static('data'),
        serveIndex('data', {'icons': true})
    )
};



