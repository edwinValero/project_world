const mysql = require('mysql');

let db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: 'root',
    database:'world'
});

console.log('Connection ...');


module.exports= db