const connection = require('./connection.js');
const {promisify} = require('util');
const logger = require('../services/logger');
const ct = require('./constants');

function consultCountries(code){
    return connection().then(db=>{
        db.query = promisify(db.query);
        let qr = `select * from world_project_db.countries c`;
        if(code){
            qr +=` where c.code = '${code}' `;
        }
        let result = db.query(qr);
        return result;
    }).catch(err=>{
        logger.error('Error in consultCountries the database layer: ', err);
        throw new Error(err);
    });     
}

async function createCountry(data, country){
    let {name} = data;
    if(!country || !name)  throw new Error( ct.ERROR_NO_DATA);
    return connection().then(db=>{
        let qr = `INSERT INTO  world_project_db.countries SET ? `;
        let post = {code: country, name: name};
        db.query = promisify(db.query);
        return db.query(qr,post);
    }).catch(err=>{
        logger.error('Error in createCountry the database layer: ', err);
        throw  new Error(err);
    });    
}

function deleteCountry( code){
    return connection().then((db)=>{
        let qr =`DELETE FROM world_project_db.countries where code = '${code}'`;
        db.query = promisify(db.query);
        let result = db.query(qr);
        return result;        
    }).catch((err)=>{
        logger.error('Error in  deleteCountry the database layer: ', err);
        throw new Error(err); 
    });
}

async function updateCountry( code, name){
    if( !code || !name)  throw new Error( ct.ERROR_NO_DATA);
    return consultCountries(code).then((countries)=>{
        if(countries.length){
            return update(code, name);
        }else{
            return createCountry({ name: name }, code);
        }
    }).catch((err)=>{
        logger.error('Error in updateCountry the database layer: ', err);
        throw new Error(err);
    });
}

async function update( code, name){
    if(!code || !name)  throw new Error( ct.ERROR_NO_DATA);
    connection().then((db)=>{
        let qr = `UPDATE world_project_db.countries SET name = '${name}' 
        Where code = '${code}'`;
        db.query = promisify(db.query);
        let results = db.query(qr);
        return results;
    }).catch((err)=>{
        logger.error('Error in update the database layer: ', err);
        throw new Error(err);
    });
}


module.exports= {
    consultCountries: consultCountries,
    createCountry: createCountry,
    deleteCountry: deleteCountry,
    updateCountry: updateCountry
}