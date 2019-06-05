const connection = require('./connection.js');
const {promisify} = require('util');
const logger = require('../services/logger');
const ct = require('./constants');
const cityCrud = require('./city_crud');
//todo pendiente
function consultSisters(code1, code2){
    return connection().then((db)=>{
        db.query = promisify(db.query);
        let qr = `select * from world_project_db.sisters c`;
         if(code ){
            qr +=` where c.city1 = '${code1}' or c.city2 = '${code2}' `;
        }
        let result = db.query(qr);
        return result;
    }).catch((err)=>{
        logger.error('Error in consultSisters the database layer: ', err);
        throw new Error(err);
    });     
}

async function createSister(code1, code2){
    if(!country || !sister || !name)  throw new Error( ct.ERROR_NO_DATA);
    return connection().then((db)=>{
        let qr = `INSERT INTO  world_project_db.sisters SET ? `;
        let post = {country: country, code:sister, name: name};
        db.query = promisify(db.query);
        return db.query(qr,post);
    }).catch((err)=>{
        logger.error('Error in createSister the database layer: ', err);
        throw  new Error(err);
    });    
}

function deleteSister(country, code){
    return connection().then((db)=>{
        let qr =`DELETE FROM world_project_db.sisters where country = '${country}' and code = '${code}'`;
        db.query = promisify(db.query);
        let result = db.query(qr);
        return result;        
    }).catch((err)=>{
        logger.error('Error in  deleteSister the database layer: ', err);
        throw new Error(err); 
    });
}

async function updateSister(country, code, name){
    if(!country || !code || !name)  throw new Error( ct.ERROR_NO_DATA);
    return consultSisters(code, country).then((sisters)=>{
        if(sisters.length){
            return update(country, code, name);
        }else{
            return createSister({sister: code, name: name }, country);
        }
    }).catch((err)=>{
        logger.error('Error in updateSister the database layer: ', err);
        throw new Error(err);
    });
}

async function update(country, code, name){
    if(!country || !code || !name)  throw new Error( ct.ERROR_NO_DATA);
    connection().then((db)=>{
        let qr = `UPDATE world_project_db.sisters SET name = '${name}' 
        Where country= '${country}' and code = '${code}'`;
        db.query = promisify(db.query);
        let results = db.query(qr);
        return results;
    }).catch((err)=>{
        logger.error('Error in update the database layer: ', err);
        throw new Error(err);
    });
}

async function haveCities(country, code){
    try{
        let result = await cityCrud.consultCities(undefined, code, country);
        return result.length > 0;
    }catch(err){
        return false;
    }
}



async function deleteSister2(country, code){
    if(!country || !code ) throw new Error(ct.ERROR_NO_DATA);
    //if(db.state === 'disconnected') throw new Error( ct.ERROR_CONNECTION);   
    try{
        let exist= await consultSisters(code, country);
        if(exist.length === 0){
            throw new Error('The sister does not exist!'); 
        }
        if( await haveCities(country, code)){
            throw new Error('The selected sister has associated cities and can not be deleted!'); 
        }
        let qr =`DELETE FROM world_project_db.sisters where country = '${country}' and code = '${code}'`;
        let db = await connection();
        db.query = promisify(db.query);
        let result = await db.query(qr);
        db.end();
        logger.info('deleted ' + result.affectedRows + ' rows');
        return result;        
    }catch(err){
        logger.error('Error in  deleteSister the database layer: ', err);
        throw new Error(err); 
    }
}



async function updateSister2(country, code, name){
    if(!country || !code || !name)  throw new Error( ct.ERROR_NO_DATA);
    try{
        let sister = await consultSisters(country, code);
        if(sister.length){
            return await update2(country, code, name);
        }else{
            return await createSister({sister: code, name: name }, req.params.country);
        }
    }catch(err){
        logger.error('Error in updateSister the database layer: ', err);
        throw err;
    }
}

async function update2(country, code, name){
    if(!country || !code || !name)  throw new Error( ct.ERROR_NO_DATA);
    let db = await connection();
    //if(db.state === 'disconnected') throw new Error( ct.ERROR_CONNECTION);   
    try{        
        let qr = `UPDATE world_project_db.sisters SET name = '${name}' 
        Where country= '${country}' and code = '${code}'`;
        db.query = promisify(db.query);
        let results = await db.query(qr);
        logger.info('changed ' + results.changedRows + ' rows');
        db.end();
        return results;
    }catch(err){
        db.end();
        logger.error('Error in update the database layer: ', err);
        throw err;
    }
}

module.exports= {
    consultSisters: consultSisters,
    createSister: createSister,
    deleteSister: deleteSister,
    updateSister: updateSister
}