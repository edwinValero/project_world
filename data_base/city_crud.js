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
function consultSistersCities(code1){
    return connection().then((db)=>{
        db.query = promisify(db.query);        
        let qr = `select * from world_project_db.sisters c`;
        if(code1){
            qr +=` where c.city1 = '${code1}' or c.city2 = '${code1}' `;
        }
        let result = db.query(qr);
        return result;
    });     
}

function consultCitiesAndSisters(city,region,country){
    return consultCities(city,region,country).then(cities=>{
        const sistersPromises = cities.map(async (value)=>{
            return consultSistersCities(value.code);
        });
        return Promise.all(sistersPromises).then(sisters=>{
            return joinCitiesAndSisters(cities, sisters);
        })
    }).catch(err=>{
        if(typeof err === 'string') return err;
        logger.error('Error in consultCitiesAndSisters the database layer: ', err);
        throw new Error(err);  
    })
}

function joinCitiesAndSisters(cities, sisters){
    let sistersArray = sisters.flat();
    return cities.map(value=>{
        value.sisters = sistersArray.reduce((acum, val)=>{
            if(val.city1 === value.code || val.city2 === value.code){
                acum.push(val);
            }
            return acum;
        },[]);
        return value;
    });
}

async function consultCities(city,region,country){
    return connection().then(db=>{
        db.query = promisify(db.query);
        let qr = `select * from world_project_db.cities c`;
        let filter = getFilters(city,region,country);
        if(filter === ' where ') throw cts.ERROR_NO_DATA; 
        let result = db.query(qr+filter);  
        return result;
    });
}

async function consultSeveralCities(cities){
    return connection().then((db)=>{
        db.query = promisify(db.query);
        let qr = `select * from world_project_db.cities c where c.code in (${cities.join(',')})`;
        let result = db.query(qr);  
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
    if(!qrData.country || !qrData.region || !qrData.code)  throw cts.ERROR_NO_DATA;
    return consultCities(qrData.code).then(cities=>{
        if(cities.length > 0) throw 'The city already exists';
        return create(qrData);
    }).then(result=>{
        return { 
            message:'City was created',
            data: qrData,
            sql:result
        };
    }).catch((err)=>{
        if(typeof err === 'string') throw err;
        logger.error('Error in createCity the database layer: ', err);
        throw new Error(err);
    });
}

function create(data){
    return connection().then((db)=>{
        let qr = `INSERT INTO  world_project_db.cities SET ? `;
        db.query = promisify(db.query);
        let result = db.query(qr,data);
       return result;
    });
}

async function deleteCity(city, region, country){
    if(!city && !region && !country )  throw cts.ERROR_NO_DATA;
    return consultCitiesAndSisters(city, region, country).then(exits=>{
        if(exits.length === 0) throw 'The city does not exist';
        if(exits.some(value=> value.sisters.length)) throw 'The city has associated sisters and can not be erased'; 
        return deleteC(city, region, country);
    }).then(result=>{
        return {
            message: 'The city(ies) was deleted',
            deleted: {
                city: city,
                allCitiesOfRegion: region,
                allCitiesOfCountry: country
            },
            sql:result
        }
    }).catch((err)=>{
        if(typeof err === 'string') throw err;
        logger.error('Error in  deleteCity the database layer: ', err);
        throw new Error(err);
    });
}

function deleteC(city, region, country){
    return connection().then((db)=>{
        db.query = promisify(db.query);
        let qr =`DELETE FROM world_project_db.cities c `;
        let filter =getFilters(city,region,country);

        if(filter === ' where ') throw cts.ERROR_NO_DATA;         
        result =  db.query(qr+filter);
        return result;
    });
}

async function updateCity(data){
    let qrData = {
        code :data.code,
        region:data.region,
        country:data.country,
        name:data.name,
        latitude:data.latitude,
        longitude:data.longitude,
        population:data.population
    }
    if(!data.code)  throw cts.ERROR_NO_DATA;
    return consultCities(data.city,data.region,data.country).then((cities)=>{
        if(cities.length){
            return update(qrData);
        }else{
            return create(qrData);
        }
    }).then(result=>{
        return { 
            message:'City was updated',
            data: qrData ,
            sql:result
        };
    }).catch((err)=>{
        if(typeof err === 'string') throw err;
        logger.error('Error in updateCity the database layer: ', err);
        throw new Error(err);
    });
}

async function update(data){
    let { name , latitude ,  longitude , population,country ,region} = data
    if(!data.code )  throw cts.ERROR_NO_DATA;
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
    });  
}

module.exports= {
    consultCities: consultCities,
    consultCitiesAndSisters: consultCitiesAndSisters,
    createCity: createCity,
    deleteCity: deleteCity,
    updateCity: updateCity,
    consultSeveralCities :consultSeveralCities
}