const db = require('./connection.js');
const {promisify} = require('util');

async function getCity(code, country, region){
    try{
        db.query = promisify(db.query);
       
        let qr = `select * country from proyect_world.cities c where c.code =${code} limit 1`;
        let result = await db.query(qr);
        return result[0];
    }catch(err){
        throw new Error('Error data base layer: ', err);
    }   
}

async function mostPopulated(){
    db.query = promisify(db.query);
    let qr = 'select c.Name, c.Population, a.Name country from world.city c, world.country a where a.Code = c.CountryCode ORDER BY c.Population desc limit 1';
    let result = await db.query(qr);
    console.log(`La ciudad del mundo más poblada es -${result[0].Name}- ubicada en -${result[0].country}- con una población de ${result[0].Population}.`);
}

async function mostPopulatedColombia(){
    db.query = promisify(db.query);
    let qr = `select c.Name, c.Population from world.city c where 'COL'= c.CountryCode ORDER BY c.Population desc limit 1`;
    let result = await db.query(qr);
    console.log(`La ciudad de Colombia más poblada es -${result[0].Name}- con una población de ${result[0].Population}.`);
}

function orderResults(result, resultL){
    return result.reduce((acum, value)=>{
        let country = acum.findIndex(cts => cts.Name === value.Name);
        if(country == -1){
            country = { 
                Name: value.Name, 
                cities:[{Name: value.city, Population: value.populationCity}], 
                language: resultL.reduce((acum, val)=>{
                    if(value.Code ===  val.Code){
                        acum.push(val.Language);
                    }
                    return acum;
                },[]),
                Population: value.Population
            };
            acum.push(country);
        }else{
            acum[country].cities.push({city: value.city, population: value.populationCity});
        }
        return acum;
    },[]);
}

async function fourCountries(){
    try{
        db.query = promisify(db.query);
        let qr = `select co.Code ,co.Name, c.Name city, c.Population populationCity, co.Population
        from world.city c,  world.country co
        where co.code in  ${CITIES_SEARCH}
        and c.CountryCode = co.Code`;

        let qrLan = `select co.Code, cl.Language 
        from world.country co, world.countrylanguage cl
        where co.code in ${CITIES_SEARCH}
        and cl.CountryCode = co.Code
        and cl.IsOfficial = 'T'`;

        let result = await db.query(qr);        
        let resultL =  await db.query(qrLan);        
        let countries = orderResults(result, resultL);
        print(countries);
        db.end();
    }catch(err){
        console.log('Error: ----------------', err);
        db.end();   
    }
}

async function run(){
    await mostPopulated();
    await mostPopulatedColombia();
    await fourCountries();
  }
run();