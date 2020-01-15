const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

// parse application/json
app.use(bodyParser.json({limit: '50mb'}));

require('./route-explore')({express, app});
require('./route-record')(app);

let port = (+ process.env['PORT']) || 3900;
app.listen(port);
console.log('Server started on port ' + port);
