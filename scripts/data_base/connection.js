const mysql = require('mysql');
const logger = require('../services/logger');
const  result = require('dotenv').config();

if (result.error) {
    throw result.error
}

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

let db = async ()=>{
    try{
        return mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        });
    }catch(err){
        logger.error(' Problem to connect to the database: ', err);
    }     
};

module.exports= db