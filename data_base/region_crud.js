const connection = require('./connection.js');
const {promisify} = require('util');
const logger = require('../services/logger');
const ct = require('./constants');
const cityCrud = require('./city_crud');

async function consultRegions(code, country){
    let db = await connection();
    //if(db.state === 'disconnected') throw new Error( ct.ERROR_CONNECTION);   
    try{
        db.query = promisify(db.query);
        let qr = `select * from proyect_world.regions c`;
        if(code && country){
            qr += ` where  c.code = '${code}' and c.country = '${country}'`;
        }else if(code ){
            qr +=` where c.code = '${code}' `;
        }else if(country ){
            qr +=` where c.country = '${country}' `;
        }
        logger.info('qr: '+qr);
        let result = await db.query(qr);
        db.end();
        return result;
    }catch(err){
        db.end();
        logger.error('Error in consultRegions the database layer: ', err);
        throw new Error(err.sqlMessage);
    }    
}

async function createRegion(data, country){
    let { region, name} = data;
    if(!country || !region || !name)  throw new Error( ct.ERROR_NO_DATA);
    let db = await connection();    
    //if(db.state === 'disconnected') throw new Error( ct.ERROR_CONNECTION);   
    try{
        let qr = `INSERT INTO  proyect_world.regions SET ? `;
        let post = {country: country, code:region, name: name};
        db.query = promisify(db.query);
        let result = await db.query(qr,post);
        db.end();
        data.country = country;
        data.result = result;
        return data;
    }catch(err){
        db.end();
        logger.error('Error in createRegion the database layer: ', err);
        throw err;
    }

}
async function haveCities(country, code){
    try{
        let result = await cityCrud.consultCities(undefined, code, country);
        return result.length > 0;
    }catch(err){
        return false;
    }
}

async function deleteRegion(country, code){
    if(!country || !code ) throw new Error(ct.ERROR_NO_DATA);
    //if(db.state === 'disconnected') throw new Error( ct.ERROR_CONNECTION);   
    try{
        let exist= await consultRegions(code, country);
        if(exist.length === 0){
            throw new Error('The region does not exist!'); 
        }
        if( await haveCities(country, code)){
            throw new Error('The selected region has associated cities and can not be deleted!'); 
        }
        let qr =`DELETE FROM proyect_world.regions where country = '${country}' and code = '${code}'`;
        let db = await connection();
        db.query = promisify(db.query);
        let result = await db.query(qr);
        db.end();
        logger.info('deleted ' + result.affectedRows + ' rows');
        return result;        
    }catch(err){
        logger.error('Error in  deleteRegion the database layer: ', err);
        throw new Error(err); 
    }
}

async function updateRegion(country, code, name){
    if(!country || !code || !name)  throw new Error( ct.ERROR_NO_DATA);
    try{
        let region = await consultRegions(country, code);
        if(region.length){
            return await update(country, code, name);
        }else{
            return await createRegion({region: code, name: name }, req.params.country);
        }
    }catch(err){
        logger.error('Error in updateRegion the database layer: ', err);
        throw err;
    }
}

async function update(country, code, name){
    if(!country || !code || !name)  throw new Error( ct.ERROR_NO_DATA);
    let db = await connection();
    //if(db.state === 'disconnected') throw new Error( ct.ERROR_CONNECTION);   
    try{        
        let qr = `UPDATE proyect_world.regions SET name = '${name}' 
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
    consultRegions: consultRegions,
    createRegion: createRegion,
    deleteRegion: deleteRegion,
    updateRegion: updateRegion,
    errorDB : ct.ERROR_CONNECTION,
    errorData: ct.ERROR_NO_DATA
}