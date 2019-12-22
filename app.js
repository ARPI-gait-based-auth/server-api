const express = require('express');
const app = express();

require('./route-explore')({express, app});
require('./route-record')(app);

app.listen(3900);
console.log('Server started on port 3900.');
