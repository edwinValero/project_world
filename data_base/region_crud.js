const connection = require('./connection.js');
const {promisify} = require('util');
const logger = require('../services/logger');
const ct = require('./constants');
const cityCrud = require('./city_crud');

function consultRegions(code, country){
    return connection().then((db)=>{
        db.query = promisify(db.query);
        let qr = `select * from world_project_db.regions c`;
        if(code && country){
            qr += ` where  c.code = '${code}' and c.country = '${country}'`;
        }else if(code ){
            qr +=` where c.code = '${code}' `;
        }else if(country ){
            qr +=` where c.country = '${country}' `;
        }
        let result = db.query(qr);
        return result;
    }).catch((err)=>{
        logger.error('Error in consultRegions the database layer: ', err);
        throw new Error(err);
    });     
}

async function createRegion(data, country){
    let { region, name} = data;
    if(!country || !region || !name)  throw new Error( ct.ERROR_NO_DATA);
    return consultRegions( region, country).then(regions=>{
        if(regions.length > 0) throw 'The region already exists';
        return create(country, region, name);
    }).then(result=>{
        return { 
            message:'Region was created',
            data: { region: region, name: name, country: country} ,
            sql:result
        };
    }).catch((err)=>{
        if(typeof err === 'string') return err;
        logger.error('Error in createRegion the database layer: ', err);
        throw  new Error(err);
    });
}

function create(country, region, name){
    return connection().then((db)=>{
        let qr = `INSERT INTO  world_project_db.regions SET ? `;
        let post = {country: country, code:region, name: name};
        db.query = promisify(db.query);
        return db.query(qr,post);
    });  
}

function deleteRegion(country, code){
    if(!country || !code )  throw new Error( ct.ERROR_NO_DATA);
    return consultRegions( code, country).then(regions=>{
        if(regions.length === 0) throw 'The region does not exist';
        return cityCrud.consultCities(undefined, code, country);
    }).then(cities=>{
        if(cities.length > 0) throw 'The region has associated cities, it can not be deleted.';
        return deleteR(country, code);
    }).then(result=>{
        return { 
            message:'The region was deleted',
            data: {country: country, region: code},
            sql:result
        };
    }).catch((err)=>{
        if(typeof err === 'string') return err;
        logger.error('Error in deleteRegion the database layer: ', err);
        throw  new Error(err);
    }); 
}

function deleteR(country, code){
    return connection().then((db)=>{
        let qr =`DELETE FROM world_project_db.regions where country = '${country}' and code = '${code}'`;
        db.query = promisify(db.query);
        let result = db.query(qr);
        return result;        
    });
}

async function updateRegion(country, code, name){
    if(!country || !code || !name)  throw new Error( ct.ERROR_NO_DATA);
    return consultRegions(code, country).then((regions)=>{
        if(regions.length){
            return update(country, code, name);
        }else{
            return create(country ,code, name);
        }
    }).then(result=>{
        return { 
            message:'The region was updated',
            data: {country: country, region: code, name: name},
            sql:result
        }; 
    }).catch((err)=>{
        logger.error('Error in updateRegion the database layer: ', err);
        throw new Error(err);
    });
}

async function update(country, code, name){
    return connection().then((db)=>{
        let qr = `UPDATE world_project_db.regions SET name = '${name}' 
        Where country= '${country}' and code = '${code}'`;
        db.query = promisify(db.query);
        let results = db.query(qr);
        return results;
    });
}

module.exports= {
    consultRegions: consultRegions,
    createRegion: createRegion,
    deleteRegion: deleteRegion,
    updateRegion: updateRegion
}