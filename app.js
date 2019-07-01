var http = require('http');
var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'smart_fridge'
});

app.use("/res", express.static(__dirname + '/res'));
app.use('/javascript', express.static(__dirname + '/javascript'));
app.use("/style.css", express.static(__dirname + "/style.css"));
app.use('/index.js', express.static(__dirname + '/index.js'));

const hostname = '127.0.0.1';
const port = 3000;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/getPosts', (req, res) => {
    var queryString = "SELECT title, description, DATE(created_at) AS date, content FROM blogposts LIMIT 4"
    connection.query(queryString, function(err, results, fields) {
        if (err) throw err;
        console.log(results);
        res.json(results);
    });
});

app.listen(port);

console.log(connection);
console.log("Server is listening at " + hostname + " on port: " + port);