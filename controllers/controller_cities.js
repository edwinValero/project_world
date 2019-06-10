const citiesCrud = require('../data_base/city_crud.js');
const ct = require('../data_base/constants');

async function consultCities(req, res){
    let {country, region} = req.body;   
    if(!country && !region && !req.params.city) return  res.status(400).send(ct.ERROR_NO_DATA);

    return citiesCrud.consultCitiesAndSisters(req.params.city, region, country).then((cities)=>{
        let response = {
            result: cities,
            links: getLinks(req, {country:country, region:region, city:req.params.city})
        };
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });
    
}

async function deleteCities(req, res){
    let {country, region} = req.body;
    let city = req.params.city;
    if(!country && !region && !req.params.city) return  res.status(400).send(ct.ERROR_NO_DATA);

    return citiesCrud.deleteCity(city,region,country).then(()=>{
        res.status(204).send();
    }).catch(err=>{
        if(typeof err === 'string')  return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });    
   
}

async function postCities(req, res) {
    req.body.code= req.params.city;
    let { country, region, code} = req.body;
    if(!country || !region || !code) return  res.status(400).send(ct.ERROR_NO_DATA);
    return citiesCrud.createCity(req.body).then((result)=>{
        let response = {
            result: result,
            links: getLinks(req,{country:country, region:region, city:code})
        }
        res.status(201).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });    
}

async function putCities(req, res){
    req.body.code= req.params.city;
    let { country, region, code} = req.body;
    if(!country || !region || !code) return  res.status(400).send(ct.ERROR_NO_DATA);

    return citiesCrud.updateCity(req.body).then((result)=>{
        let response = {
            result: result,
            links: getLinks(req,{country:country, region:region, city:code})
        }
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    }); 
}

function getLinks(req, data){
    let city = data.city || ':city';
    let country = data.country || ':country';
    let region = data.region || ':region';
    let root =`${req.protocol}://${req.hostname}:8080`;
    let getCitiesByCountryRegions= `getCitiesByCountryRegions: ${root}/cities (body:{region: ${region},country: ${country}}`;
    let getCity= `getCity: ${root}/cities/${city}`;
    let postCity= `postCity: ${root}/cities/${city} (body:{region, country, name, latitude, longitude, population})`;
    let putCity= `putCity: ${root}/cities/${city} (body:{region, country, name, latitude, longitude, population})`;
    let deleteCity= `deleteCity: ${root}/cities/${city}`;
    let deleteCityQuery= `deleteCityQuery: ${root}/cities (body: {region: ${region},country: ${country}})`;
    let result=[];
    switch(req.method){
        case 'GET':
            result.push(postCity);
            result.push(putCity);
            result.push(deleteCity);
            result.push(deleteCityQuery);
            break;
        case 'POST':
            result.push(getCitiesByCountryRegions);
            result.push(getCity);
            result.push(putCity);
            result.push(deleteCity);
            result.push(deleteCityQuery);
            break;
        case 'PUT':
            result.push(getCitiesByCountryRegions);
            result.push(getCity);
            result.push(postCity);
            result.push(deleteCity);
            result.push(deleteCityQuery);
            break;
        default:
            result = undefined;
            break;
    }
    return result;
}
module.exports = {
consultCities: consultCities,
deleteCities: deleteCities,
postCities: postCities, 
putCities: putCities
}