const db = require('../data_base/connection.js');
const {promisify} = require('util');
const csv = require('csv-parser');  
const fs = require('fs');
let  countries = [];
fs.createReadStream('country-codes.csv')  
  .pipe(csv())
  .on('data', (row) => {
      if(row['ISO3166-1-Alpha-2']){
        countries.push([ row['ISO3166-1-Alpha-2'], row.official_name_en]);
      }
  })
  .on('end', async() => {
    await insertCountries(countries);
    db.end();
    console.log('CSV file successfully processed');
  }); 

async function insertCountries(data){
    db.query = promisify(db.query);
    let qr = `INSERT INTO proyect_world.country (code,name)  VALUES ?  `;
    await db.query(qr, [data]);
    return;
}

