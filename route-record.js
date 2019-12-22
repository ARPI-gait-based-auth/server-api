const conf = require('./config');

function runPy(scriptName, args) {
    return new Promise(function(success, nosuccess) {

        const { spawn } = require('child_process');
        const pyprog = spawn('python', [`./scripts/${ scriptName }.py`, ...args]);

        pyprog.stdout.on('data', function(data) {
            success(data.toString());
        });

        pyprog.stderr.on('data', (data) => {
            nosuccess(data);
        });
    });
}

module.exports = function(app) {
    app.get('/test', function (req, res) {
        runPy('test', ['argument 1 test'])
            .then(function(scriptResponse) {
                res.send({scriptResponse})
            })
            .catch(e => {
                res.send(e.measure);
            });
    });

    app.post('/' + conf.token + '/record/:name/:key', function (req, res) {
        res.send({
            name: '1'
        })
    })
};
