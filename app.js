var http = require('http');
var express = require('express');
var app = express();
var path = require('path');

app.use("/res", express.static(__dirname + '/res'));
app.use("/style.css", express.static(__dirname + "/style.css"));

const hostname = '127.0.0.1';
const port = 3000;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port);
console.log("Server is listening at " + hostname + " on port: " + port);