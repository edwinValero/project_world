const express = require("express");
const routerCities = express.Router();
const citiesCrud = require('../data_base/city_crud.js');

async function consultCities(req, res){
    let {country, region} = req.body;
    let cities= await citiesCrud.consultCities(req.params.city, region, country);
    responseGet(cities, res);
    let response = {
        result: cities,
        links: getLinks(req)
    };
    res.send(response);
}

async function  deleteCities(req, res){
    let {country, region} = req.body;
    let city = req.params.city;
    let cities= await citiesCrud.deleteCity(city,region,country);
    responseErrorDelete(cities, res);
    let response = {
        result: cities,
        links: getLinks(req)
    };
    res.send(response);
   
}

routerCities.get("/:city", consultCities);
routerCities.get("/",consultCities);
routerCities.delete("/", deleteCities);
routerCities.delete("/:city", deleteCities);

routerCities.post("/:city", async (req, res) => {
    req.body.city= req.params.city;
    let result = await citiesCrud.createCity(req.body);
    responseErrorPost(result, res);
    let response = {
        result: result,
        links: getLinks(req)
    }
    res.status(201).send(response);
});

routerCities.put("/:city", async (req, res) => {
    let result = await citiesCrud.updateRegion(req.params.country, req.params.region, req.body.name);
    let response = {
        result: result,
        links: getLinks(req)
    }
    res.send(response);
});

function responseGet(cities, res){
    if(cities.errno || cities === citiesCrud.errorDB){
        res.status(500).send(cities);
    }
}

function responseErrorPost(result, res){
    if((result.error && result.error.errno) || result === citiesCrud.errorDB){
        res.status(500).send(result);
    }else if(result.error === citiesCrud.errorData){
        res.status(400).send(result);
    }
}

function responseErrorDelete(result, res){
    if(result.errno || result === citiesCrud.errorDB){
        res.status(500).send(result);
    }else if(result.error === citiesCrud.errorData){
        res.status(400).send(result);
    }
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