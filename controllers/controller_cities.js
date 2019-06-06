const citiesCrud = require('../data_base/city_crud.js');
const ct = require('../data_base/constants');

async function consultCities(req, res){
    let {country, region} = req.body;   
    if(!country && !region && !req.params.city) return  res.status(400).send(ct.ERROR_NO_DATA);

    return citiesCrud.consultCitiesAndSisters(req.params.city, region, country).then((cities)=>{
        let response = {
            result: cities,
            links: getLinks(req)
        };
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(400).send({problem: err});
        res.status(500).send({error: err.message});
    });
    
}

async function deleteCities(req, res){
    let {country, region} = req.body;
    let city = req.params.city;
    if(!country && !region && !req.params.city) return  res.status(400).send(ct.ERROR_NO_DATA);

    return citiesCrud.deleteCity(city,region,country).then((cities)=>{
        let response = {
            result: cities,
            links: getLinks(req)
        };
        res.status(204).send(response);
    }).catch((err)=>{
        if(typeof err === 'string')  return res.status(400).send({problem: err});
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
            links: getLinks(req)
        }
        res.status(201).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(400).send({problem: err});
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
            links: getLinks(req)
        }
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(400).send({problem: err});
        res.status(500).send({error: err.message});
    }); 
}

function getLinks(req){
    return {
        getCitiesByCountryRegions:`${req.protocol}://${req.hostname}/cities (body:{region,country}`,
        getCity:`${req.protocol}://${req.hostname}/cities/:city`,
        postRegions:`${req.protocol}://${req.hostname}/cities/:country (body:{region,name})`,
        putRegions:`${req.protocol}://${req.hostname}/cities/:country/:region (body:{name})`,
        deleteRegions:`${req.protocol}://${req.hostname}/cities/:city`,
        deleteRegionsQuery:`${req.protocol}://${req.hostname}/cities (region o country)`
    }
}
module.exports = {
consultCities: consultCities,
deleteCities: deleteCities,
postCities: postCities, 
putCities: putCities
}