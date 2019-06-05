const express = require("express");
const routerCities = express.Router();
const citiesCrud = require('../data_base/city_crud.js');
const ct = require('../data_base/constants');

routerCities.get("/:city", consultCities);
routerCities.get("/",consultCities);
routerCities.delete("/", deleteCities);
routerCities.delete("/:city", deleteCities);
routerCities.post("/:city",postCities );
routerCities.put("/:city", putCities);

async function consultCities(req, res){
    let {country, region} = req.body;   
    if(!country && !region && !req.params.city) return  res.status(400).send(ct.ERROR_NO_DATA);

    citiesCrud.consultCities(req.params.city, region, country).then((cities)=>{
        let response = {
            result: cities,
            links: getLinks(req)
        };
        res.send(response);
    }).catch((err)=>{
        res.status(500).send({error: err.message});
    });
    
}

async function  deleteCities(req, res){
    let {country, region} = req.body;
    let city = req.params.city;
    if(!country && !region && !req.params.city) return  res.status(400).send(ct.ERROR_NO_DATA);

    citiesCrud.deleteCity(city,region,country).then((cities)=>{
        let response = {
            result: cities,
            links: getLinks(req)
        };
        res.send(response);
    }).catch((err)=>{
        res.status(500).send({error: err.message});
    });    
   
}

async function postCities(req, res) {
    req.body.code= req.params.city;
    let { country, region, code} = req.body;
    if(!country || !region || !code) return  res.status(400).send(ct.ERROR_NO_DATA);
    citiesCrud.createCity(req.body).then((result)=>{
        let response = {
            result: result,
            links: getLinks(req)
        }
        res.status(201).send(response);
    }).catch((err)=>{
        res.status(500).send({error: err.message});
    });    
}

async function putCities(req, res){
    req.body.code= req.params.city;
    let { country, region, code} = req.body;
    if(!country || !region || !code) return  res.status(400).send(ct.ERROR_NO_DATA);

    citiesCrud.updateCity(req.body).then((result)=>{
        let response = {
            result: result,
            links: getLinks(req)
        }
        res.send(response);
    }).catch((err)=>{
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
module.exports = routerCities;