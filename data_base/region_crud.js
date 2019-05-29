const connection = require('./connection.js');
const {promisify} = require('util');

const ERROR_CONNECTION = 'Data base connection rejected';
const ERROR_NO_DATA = 'Insufficient data';

async function consultRegions(code, country){
    let db = await connection();
    if(db){
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
            let result = await db.query(qr);
            db.end();
            return result;
        }catch(err){
            db.end();
            console.log('Error in consultRegions the database layer: ', err);
            return err;
        }
    }
    return ERROR_CONNECTION;   
}

async function createRegion(data, country){
    let db = await connection();
    if(db){
        try{
            let { code, name} = data;
            let qr = `INSERT INTO  proyect_world.regions SET ? `;
            if(country && code && name){
                let post = {country: country, code:code, name: name};
                db.query = promisify(db.query);
                let result = await db.query(qr,post);
                db.end();
                data.result = result;
                return data;
            }else{
                db.end();
                data.error = ERROR_NO_DATA;
                return data;
            }
            
        }catch(err){
            db.end();
            console.log('Error in createRegion the database layer: ', err);
            data.error = err;
            return data;
        }
    }
    return ERROR_CONNECTION;

}

async function deleteRegion(country, code){
    let db = await connection();
    if(db){
        try{
            if(country && code ){
                let qr =`DELETE FROM proyect_world.regions where country = '${country}' and code = '${code}'`;
                db.query = promisify(db.query);
                let result = await db.query(qr);
                db.end();
                console.log('deleted ' + result.affectedRows + ' rows');
                return result;
            }else{
                db.end();
                return ERROR_NO_DATA;
            }
        }catch(err){
            db.end();
            console.log('Error in  deleteRegion the database layer: ', err);
            return err;
        }
    }
    return ERROR_CONNECTION;
}

async function updateRegion(country, code, name){
    let db = await connection();
    if(db){
        try{        
            if(country && code && name){
                let qr = `UPDATE proyect_world.regions SET name = '${name}' 
                Where country= '${country}' and code = '${code}'`;
                db.query = promisify(db.query);
                let results = await db.query(qr);
                console.log('changed ' + results.changedRows + ' rows');
                db.end();
                return results;
            }else{
                db.end();
                return ERROR_NO_DATA;
            }
            
        }catch(err){
            db.end();
            console.log('Error in createRegion the database layer: ', err);
            return err;
        }
    }
    return ERROR_CONNECTION;
}

module.exports= {
    consultRegions: consultRegions,
    createRegion: createRegion,
    deleteRegion: deleteRegion,
    updateRegion: updateRegion,
    errorDB : ERROR_CONNECTION,
    errorData: ERROR_NO_DATA
}