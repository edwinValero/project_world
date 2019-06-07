const connection = require('./connection.js');
const {promisify} = require('util');
const logger = require('../services/logger');
const regionCrud = require('./region_crud');
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
    if(!country || !name)  throw ct.ERROR_NO_DATA;
    return consultCountries(country).then(countries=>{
        if(countries.length > 0) throw 'The country already exists';
        return create( country, name);
    }).then(result=>{
        return { 
            message:'Country was created',
            data: { name: name, country: country} ,
            sql:result
        };
    }).catch(err=>{
        if(typeof err === 'string') return err;
        logger.error('Error in createCountry the database layer: ', err);
        throw  new Error(err);
    });    
}

function create(country, name ){
    return connection().then(db=>{
        let qr = `INSERT INTO  world_project_db.countries SET ? `;
        let post = {code: country, name: name};
        db.query = promisify(db.query);
        return db.query(qr,post);
    });    
}

function deleteCountry(country){
    return consultCountries(country).then(countries=>{
        if(countries.length === 0) throw 'The country does not exist';
        return regionCrud.consultRegions(undefined, country);
    }).then(regions =>{
        if(regions.length > 0) throw 'The country has associated regions, it can not be deleted.';
        return deleteC( country);
    }).then(result=>{
        return { 
            message:'Country was deleted',
            data: { country: country} ,
            sql:result
        };
    }).catch(err=>{
        if(typeof err === 'string') return err;
        logger.error('Error in createCountry the database layer: ', err);
        throw  new Error(err);
    });    
}

function deleteC(code){
    return connection().then((db)=>{
        let qr =`DELETE FROM world_project_db.countries where code = '${code}'`;
        db.query = promisify(db.query);
        let result = db.query(qr);
        return result;        
    });
}

async function updateCountry( code, name){
    if( !code || !name)  throw ct.ERROR_NO_DATA;
    return consultCountries(code).then((countries)=>{
        if(countries.length){
            return update(code, name);
        }else{
            return create(code, name );
        }
    }).then(result=>{
        return { 
            message:'Country was updated',
            data: { name: name, country: code} ,
            sql:result
        };
    }).catch((err)=>{
        logger.error('Error in updateCountry the database layer: ', err);
        throw new Error(err);
    });
}

async function update( code, name){
    return connection().then((db)=>{
        let qr = `UPDATE world_project_db.countries SET name = '${name}' 
        Where code = '${code}'`;
        db.query = promisify(db.query);
        let results = db.query(qr);
        return results;
    });
}


module.exports= {
    consultCountries: consultCountries,
    createCountry: createCountry,
    deleteCountry: deleteCountry,
    updateCountry: updateCountry
}