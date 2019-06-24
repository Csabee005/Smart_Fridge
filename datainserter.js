var faker = require('faker');
var mysqlConnector = require('mysql');

var connection = mysqlConnector.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'join_us',
});
/*
 SELECTING DATA
var query = 'SELECT COUNT(*) AS total FROM users';
connection.query(query, function(error, results, fields) {
    if (error) throw error;
    console.log(results[0].total);
});*/

/*INSERTING HARDCODED DATA
var query = 'INSERT INTO users (email) VALUES("rusty_the_dog@mail.com")';

connection.query(query, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
});*/

var data = []
for (i = 0; i < 800; i++) {
    data.push([
        faker.internet.email(),
        faker.date.past()
    ]);
}

connection.query('INSERT INTO users (email, created_at) VALUES ?', [data], function(error, results, fields) {
    if (error) throw error;
    console.log(results);
});

connection.end();

function generateAddress() {
    console.log(faker.internet.email());
    console.log(faker.date.past());
    console.log(faker.address.city());
}