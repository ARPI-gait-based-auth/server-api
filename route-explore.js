const serveIndex = require('serve-index');

module.exports = function ({express, app}) {
    app.use(
        '/explore',
        express.static('data'),
        serveIndex('data', {'icons': true})
    )
};



