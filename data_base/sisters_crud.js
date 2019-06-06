const connection = require('./connection.js');
const {promisify} = require('util');
const logger = require('../services/logger');
const ct = require('./constants');
const cityCrud = require('./city_crud');
//todo pendiente
function consultSisters(code1, code2){
    if(code2 && !code1)  throw  ct.ERROR_NO_DATA;
    return citiesExist([code1,code2]).then(exist=>{
        if(!exist)  throw 'One or more cities do not exist';
        return consult(code1, code2);
    }).then(sisters=>{
        let result = sisters;        
        if(code1 && code2){
            let index = getIndexOfSisters(sisters, code1, code2);
            if(index != -1)  result = [sisters[index]];
        }        
        return result;
    }).catch(err=>{
        if(typeof err === 'string') return err;
        logger.error('Error in consultSisters the database layer: ', err);
        throw new Error(err);
    });  
}

function getIndexOfSisters(sisters, code1, code2){
    let index = sisters.indexOf({city1:code1, city2:code2});
    if(!index){
        index = sisters.indexOf({city1:code2, city2:code1});
    }
    return index;
}

function consult(code1, code2){
    return connection().then((db)=>{
        db.query = promisify(db.query);
        let qr = `select * from world_project_db.sisters c`;
         if(code1 && code2 ){
            qr +=` where c.city1 = '${code1}' or c.city1 = '${code2}' `;
        }else if(code1){
            qr +=` where c.city1 = '${code1}' or c.city2 = '${code1}' `;
        }
        let result = db.query(qr);
        return result;
    });     
}

async function citiesExist(cities){
    cities= cities.reduce((acum, val)=>{
        if(val){
            acum.push(val);
        }
        return acum;
    },[]);
    return cityCrud.consultSeveralCities(cities).then(result=>{            
        return result.length === cities.length;
    });
}

async function createSister(code1, code2){
    if(!code1 || !code2)  throw new Error( ct.ERROR_NO_DATA);
    return consultSisters(code1, code2).then(exist =>{
        if(exist.length > 0) throw 'The cities are already sisters';
        return create(code1,code2);
    }).then((result)=>{
        return {
            message : 'Sister cities created in the database',
            data:{city1:code1, city2: code2},
            result:result
        };
    }).catch(err=>{
        if(typeof err === 'string') return err;
        logger.error('Error in createSister the database layer: ', err);
        throw new Error(err);
    });
   
}

function create(code1, code2){
    return connection().then((db)=>{
        let qr = `INSERT INTO  world_project_db.sisters SET ? `;
        let post = {city1: code1, city2:code2};
        db.query = promisify(db.query);
        return db.query(qr,post);
    });    
}

function deleteSister(code1, code2){
    if(!code1 || !code2)  throw new Error( ct.ERROR_NO_DATA);
    return consultSisters(code1, code2).then(sisters=>{
        if(sisters.length === 0) throw 'Relationship of the cities does not exist';
        return deleteRelationship(sisters[0].city1,sisters[0].city2);
    }).then(result=>{
        return {
            message : 'Relationship of cities was deleted',
            data:{city1:code1, city2: code2},
            result:result
        };
    }).catch(err=>{
        if(typeof err === 'string') return err;
        logger.error('Error in  deleteSister the database layer: ', err);
        throw new Error(err); 
    })
}

function deleteRelationship(code1, code2){
    return connection().then((db)=>{
        let qr =`DELETE FROM world_project_db.sisters where city1 = '${code1}' and city2 = '${code2}'`;
        db.query = promisify(db.query);
        let result = db.query(qr);
        return result;        
    });
}

module.exports= {
    consultSisters: consultSisters,
    consultSister: consult,
    createSister: createSister,
    deleteSister: deleteSister
}