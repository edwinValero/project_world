const db = require('../connection.js');
const {promisify} = require('util');
const fs = require('fs');
let  regions = [];
let  count = 0;
fs.readFile('admin1CodesASCII.txt', 'utf8', async function(err, contents) {
    if(err) return console.log('err', err);
    
    let res = contents.toString().split('\n');
    res.map(value=>{
        regions.push(value.split('.'));
    });
    let data = regions.map(value =>{
        return [ value[0], value[1], value[2]];
    });
    data.forEach(async (dat) =>{
        try{
            await insertRegions([dat]);
        }catch(err){
            if(err.code != 'ER_DUP_ENTRY') console.log(dat[0], err.code);   
        }
        return dat;
    });
    db.end();
});

async function insertRegions(data){
    db.query = promisify(db.query);
    let qr = `INSERT INTO proyect_world.regions (country,code,name)  VALUES ?  `;
    await db.query(qr, [data]);
    return;
}

