const express = require('express');
const app = express();

require('./route-explore')({express, app});
require('./route-record')(app);

let port = (+ process.env['PORT']) || 3900;
app.listen(port);
console.log('Server started on port ' + port);
