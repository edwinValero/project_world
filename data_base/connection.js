const mysql = require('mysql');

let db = async ()=>{
    try{
        return await mysql.createConnection({
            host:'localhost',
            user:'root',
            password: 'root',
            database:'world'
        });
    }catch(err){
        console.log('Problema para conectar con la base de datos: ', err);
    }     
};

module.exports= db