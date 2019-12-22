const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

require('./route-explore')({express, app});
require('./route-record')(app);

let port = (+ process.env['PORT']) || 3900;
app.listen(port);
console.log('Server started on port ' + port);
