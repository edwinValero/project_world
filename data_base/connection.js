const mysql = require('mysql');
const logger = require('../services/logger');

let db = async ()=>{
    try{
        return await mysql.createConnection({
            host:'localhost',
            user:'root',
            password: 'root',
            database:'world'
        });
    }catch(err){
        logger.error(' Problem to connect to the database: ', err);
    }     
};

module.exports= db