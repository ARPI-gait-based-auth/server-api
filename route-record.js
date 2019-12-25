const conf = require('./config');
const fs = require('fs');

function runPy(scriptName, args) {
    return new Promise(function (success, nosuccess) {

        const {spawn} = require('child_process');
        const pyprog = spawn('python', [`./scripts/${scriptName}.py`, ...args]);

        pyprog.stdout.on('data', function (data) {
            success(data.toString());
        });

        pyprog.stderr.on('data', (data) => {
            nosuccess(data);
        });
    });
}

module.exports = function (app) {
    app.get('/test', function (req, res) {
        runPy('test', ['argument 1 test'])
            .then(function (scriptResponse) {
                res.send({scriptResponse})
            })
            .catch(e => {
                res.send(e.measure);
            });
    });

    app.post('/' + conf.token + '/record/:name/:key', function (req, res) {
        let name = req.params.name.replace(/[^a-z0-9]/gi, '');
        let key = req.params.key.replace(/[^a-z0-9]/gi, '');

        if (!fs.existsSync(`./data/${name}`)){
            fs.mkdirSync(`./data/${name}`);
        }

        fs.writeFile(`./data/${name}/${key}.csv`, `${req.body.csv}`, function (e) {
            if (e) {
                return res.send(e.message);
            }

            runPy('on-save', [name, key])
                .then(function (scriptResponse) {
                    res.send({
                        scriptResponse,
                        name,
                        key
                    })
                })
                .catch(e => {
                    res.send(e.measure);
                });
        });
    });

    app.post('/' + conf.token + '/detect/:name', function (req, res) {
        let name = req.params.name.replace(/[^a-z0-9]/gi, '');
        runPy('auth', [name, req.body.csv])
            .then(function (scriptResponse) {
                res.send({
                    scriptResponse,
                    name
                })
            })
            .catch(e => {
                res.send(e.measure);
            });
    })
};
