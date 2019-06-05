const connection = require('./connection.js');
const {promisify} = require('util');
const logger = require('../services/logger');

const cts = require('./constants.js');

function getFilters(city,region,country){
    let filters = [];
    if(city){
        filters.push(`c.code = '${city}'`);
    }
    if(region){
        filters.push(`c.region = '${region}'` );
    }
    if(country){
        filters.push(`c.country = '${country}'`);
    }
    return ' where '+filters.join(' and ');

}

async function consultCities(city,region,country){
    return connection().then((db)=>{
        db.query = promisify(db.query);
        let qr = `select * from world_project_db.cities c`;
        let filter = getFilters(city,region,country);
        if(filter === ' where ') throw new Error( cts.ERROR_NO_DATA); 
        let result = db.query(qr+filter);  
        return result;
    }).catch((err)=>{
        logger.error('Error in consultCities the database layer: ', err);
        throw new Error(err);  
    });
}

async function createCity(data){
    let qrData = {
        code :data.code,
        region:data.region,
        country:data.country,
        name:data.name,
        latitude:data.latitude,
        longitude:data.longitude,
        population:data.population
    }
    if(!qrData.country || !qrData.region || !qrData.code)  throw new Error(cts.ERROR_NO_DATA);
    return connection().then((db)=>{
        let qr = `INSERT INTO  world_project_db.cities SET ? `;
        db.query = promisify(db.query);
        let result = db.query(qr,qrData);
       return result;
    }).catch((err)=>{
        logger.error('Error in createCity the database layer: ', err);
        throw new Error(err);
    });
}

async function deleteCity(city, region, country){
    if(!city && !region && !country )  throw new Error( cts.ERROR_NO_DATA);
    return connection().then((db)=>{
        db.query = promisify(db.query);
        let qr =`DELETE FROM world_project_db.cities c `;
        let filter =getFilters(city,region,country);

        if(filter === ' where ') throw new Error( cts.ERROR_NO_DATA);         
        result =  db.query(qr+filter);
        return result;
    }).catch((err)=>{
        logger.error('Error in  deleteCity the database layer: ', err);
        return new Error(err);
    });
}

async function updateCity(data){
    if(!data.code)  throw new Error( cts.ERROR_NO_DATA);
    return consultCities(data.city,data.region,data.country).then((cities)=>{
        if(cities.length){
            return update(data);
        }else{
            return createCity(data);
        }
    }).catch((err)=>{
        logger.error('Error in updateCity the database layer: ', err);
        throw new Error(err);
    });
}

async function update(data){
    let { name , latitude ,  longitude , population,country ,region} = data
    if(!data.code )  throw new Error( cts.ERROR_NO_DATA);
    return connection().then((db)=>{
        let qr = `UPDATE world_project_db.cities SET 
        name = ?, 
        latitude = ?, 
        longitude = ?,
        population = ?, 
        country = ?,
        region = ?
        Where code = '${data.code}'`;
        db.query = promisify(db.query);
        let results = db.query(qr,[ name , latitude ,  longitude , population,country ,region]);
        return results;
    }).catch((err)=>{
        logger.error('Error in update the database layer: ', err);
        return new Error(err);
    });  
}
//________________
async function consultCities2(city,region,country){
    let db = await connection();
    //if(db.state === 'disconnected') throw new Error( ct.ERROR_CONNECTION);   
    try{
        db.query = promisify(db.query);
        let qr = `select * from world_project_db.cities c`;
        
        let filter = getFilters(city,region,country);
        if(filter === ' where ') throw new Error( cts.ERROR_NO_DATA); 
        
        let result = await db.query(qr+filter);       
        db.end();
        return result;
    }catch(err){
        db.end();
        logger.error('Error in consultCities the database layer: ', err);
        throw err;   
    }
}

async function createCity2(data){
    let db = await connection();
    if(db.state != 'disconnected'){
        try{
            let { country, region, city} = data;
            let qr = `INSERT INTO  world_project_db.cities SET ? `;
            if(country && region && city){
                db.query = promisify(db.query);
                let result = await db.query(qr,data);
                db.end();
                data.result = result;
                return data;
            }else{
                db.end();
                data.error = cts.ERROR_NO_DATA;
                return data;
            }
            
        }catch(err){
            db.end();
            logger.error('Error in createCity the database layer: ', err);
            data.error = err;
            return data;
        }
    }
    return cts.ERROR_CONNECTION;

}

async function deleteCity2(city, region, country){
    let db = await connection();
    if(db.state != 'disconnected'){
        try{
            if(city || region || country ){
                db.query = promisify(db.query);
                let qr =`DELETE FROM world_project_db.regions `;
                let filter =getFilters(city,region,country);
                if(filter != ' where '){
                    result = await db.query(qr+filter);                
                }else{
                    result = {
                        error:cts.ERROR_NO_DATA,
                        city: city,
                        region:region,
                        country:country
                    };
                }
                db.end();
                logger.info('deleted ' + result.affectedRows + ' rows');
                return result;
            }else{
                db.end();
                return cts.ERROR_NO_DATA;
            }
        }catch(err){
            db.end();
            logger.error('Error in  deleteCity the database layer: ', err);
            return err;
        }
    }
    return cts.ERROR_CONNECTION;
}

async function updateCity2(city, data){
    let db = await connection();
    if(db.state != 'disconnected'){
        try{        
            if(country && code && name){
                //title = :title", { title: "Hello MySQL" }
                let qr = `UPDATE world_project_db.regions SET 
                name = :name , latitude = :latitude, longitude = :longitude,
                population = :population, country = :country, region = :region
                Where code = '${city}'`;
                db.query = promisify(db.query);
                let results = await db.query(qr,data);
                logger.info('changed ' + results.changedRows + ' rows');
                db.end();
                return results;
            }else{
                db.end();
                return cts.ERROR_NO_DATA;
            }
            
        }catch(err){
            db.end();
            logger.error('Error in updateCity the database layer: ', err);
            return err;
        }
    }
    return cts.ERROR_CONNECTION;
}

module.exports= {
    consultCities: consultCities,
    createCity: createCity,
    deleteCity: deleteCity,
    updateCity: updateCity,
    errorDB : cts.ERROR_CONNECTION,
    errorData: cts.ERROR_NO_DATA
}