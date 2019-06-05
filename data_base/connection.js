const mysql = require('mysql');
const logger = require('../services/logger');

let db = async ()=>{
    try{
        return mysql.createConnection({
            host:'localhost',
            user:'root',
            password: 'root',
            database:'world_project_db'
        });
    }catch(err){
        logger.error(' Problem to connect to the database: ', err);
    }     
};

module.exports= db