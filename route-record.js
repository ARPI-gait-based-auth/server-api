module.exports = function(app) {
    app.post('/record/:name/:key', function (req, res) {
        if (req.query.token !== process.env['TOKEN']) {
            res.send(401);
            return;
        }
        res.send('hello world')
    })
};
