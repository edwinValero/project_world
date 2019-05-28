const db = require('../connection.js');
const {promisify} = require('util');
const fs = require('fs');
let  regions = [];
let  count = 0;
fs.readFile('cities15000.txt', 'utf8', async function(err, contents) {
    if(err) return console.log('err', err);
    
    let res = contents.toString().split('\n');
    res.map(value=>{
        regions.push(value.split(';'));
    });
    let data = regions.map(value =>{
        return [ value[0], value[2], value[4],value[5], value[14], value[8],value[10]];
    });
    let left = [];
    data.forEach(async (dat) =>{
        try{
           if(!await findCity(dat[0])){
               console.log(dat);
           }
        }catch(err){
            if(err.code != 'ER_DUP_ENTRY') console.log(dat[0], err.code);   
        }
        return dat;
    });
    db.end();
});

async function insertCities(data){
    db.query = promisify(db.query);
    let qr = `INSERT INTO proyect_world.cities (code, name, latitude, longitude, population, country, region)  VALUES ?  `;
    await db.query(qr, [data]);
    return;
}

async function findCity(code){
    db.query = promisify(db.query);
    let qr = `select c.name from proyect_world.cities c where c.code = ${code} limit 1`;
    let result = await db.query(qr);
    return result.length > 0 ;
}


