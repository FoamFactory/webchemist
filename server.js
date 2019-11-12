var express = require('express');
var app = express();
var port = 3050;

app.use('/', express.static(__dirname + '/example'));
app.use('/builds', express.static(__dirname + '/builds'));

app.listen(port);
console.log('Listening at localhost:' + port);
