const conf = require('./config');
const actions = require('./actions');

module.exports = function (app) {
    app.post('/' + conf.token + '/record/:name/:key', function (req, res) {
        actions.saveNewRecord(req.params.name, req.params.key, req.body.csv)
            .then((data) => {
                res.send(data)
            })
            .catch(e => {
                res.send({
                    error: e.message
                });
            });
    });

    app.post('/' + conf.token + '/detect/:name', function (req, res) {
        actions.confirmRecordOwner(req.params.name, req.body.csv)
            .then((data) => {
                res.send(data)
            })
            .catch(e => {
                res.send({
                    error: e.message
                });
            });
    })
};
