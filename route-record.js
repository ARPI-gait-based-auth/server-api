const conf = require('./config');
const actions = require('./actions');
const fs = require('fs-extra');

module.exports = function (app) {

    app.get('/' + conf.token + '/detect', async function (req, res) {
        let files = await fs.readdir('./data/detect');
        files = files.filter(x => x.endsWith('.raw.csv'))
            .map(x => {
                const f = x.split('.')[0].split('-');
                return {
                    u: f[0],
                    k: f[1],
                }
            });
        res.send(`
<html>
<body><h1>Manual auth test</h1>
<p>To force other user add /:username at the end when opening link.</p>
<ul>
${  files.map(x => `<il><a href="detect/${ x.u }/${ x.k }">${ x.u } - ${ x.k }</a></il>`).join('<br>')  }</ul>
</body>
</html>`)
    });

    app.get('/logs', function (req, res) {
        res.send(`
<html>
<head>
  <meta http-equiv="refresh" content="1">
</head>
<body>
${actions.logs.join("<br>")}
</body>
</html>`)
    });

    app.get('/' + conf.token + '/retrain', function (req, res) {
        actions.retrain()
            .then((data) => {
                res.send(data)
            })
            .catch(e => {
                res.send({
                    status: "error",
                    error: e.message
                });
            });
    });

    app.post('/' + conf.token + '/record/:name/:key', function (req, res) {
        actions.saveNewRecord(req.params.name, req.params.key, req.body.csv)
            .then((data) => {
                res.send(data)
            })
            .catch(e => {
                res.send({
                    status: "error",
                    error: e.message
                });
            });
    });

    app.post('/' + conf.token + '/detect/:name', function (req, res) {
        actions.confirmRecordOwner(req.params.name, req.body.csv)
            .then((authTrust) => {
                res.send({
                    authTrust
                })
            })
            .catch(e => {
                res.send({
                    status: "error",
                    error: e.message
                });
            });
    })

    app.get('/' + conf.token + '/detect/:name/:key', function (req, res) {
        actions.confirmRecordOwner(req.params.name, null, req.params.key)
            .then((authTrust) => {
                res.send(`
<html>
<body>
<h1>Auth result</h1>
Record ${ req.params.key } belongs to <strong>${req.params.name}</strong> with <strong>${ authTrust }%</strong> probability.
</body>
</html>`)
            })
            .catch(e => {
                res.send({
                    status: "error",
                    error: e.message
                });
            });
    })

    app.get('/' + conf.token + '/detect/:name/:key/:forceModelUsername', function (req, res) {
        actions.confirmRecordOwner(req.params.name, null, req.params.key, req.params.forceModelUsername)
            .then((authTrust) => {



                res.send(`
<html>
<body>

<h1>Auth result</h1>
Record ${ req.params.key } from user ${ req.params.name } belongs to <strong>${req.params.forceModelUsername}</strong> with <strong>${ authTrust }%</strong> probability.

</body>
</html>`)
            })
            .catch(e => {
                res.send({
                    status: "error",
                    error: e.message
                });
            });
    })
};
