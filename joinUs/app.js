var mysql = require('mysql');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'join_us'
});

app.get("/", function(req, res) {
    var count = 5;
    connection.query("SELECT COUNT(*) AS count FROM users", function(err, results, fields) {
        if (err) throw err;
        console.log(results);
        count = results[0].count;
        //res.send("We have " + count + " users in our database!");
        res.render("home", { data: count });
    });

});

app.get("/joke", function(req, res) {
    var joke = "What do you call a dog that does magic tricks? A labradacabrador!";
    res.send(joke);
});

app.get("/random_num", function(req, res) {
    var number = Math.floor(Math.random() * 10) + 1;
    res.send('Your lucky number is ' + number);
});

app.post("/register", function(req, res) {
    var person = {
        email: req.body.email
    }
    connection.query("INSERT INTO users SET ?", person, function(err, results) {
        if (err) throw err;
        res.redirect("/");
    });
});

app.listen(8080, function() {
    console.log('Listening on port 8080!');
});