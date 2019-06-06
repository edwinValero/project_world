const express = require("express");
const routerCountries = express.Router();
const countriesCrud = require('../data_base/country_crud.js');
const ct = require('../data_base/constants');
const logger = require('./logger');


routerCountries.get("/", consultCountriesGet); 
routerCountries.get("/:country", consultCountriesGet);
routerCountries.post("/", postCountries);
routerCountries.post("/:country", postCountries);
routerCountries.delete("/:country",deleteCountries );
routerCountries.put("/:country",putCountries);


async function consultCountriesGet(req, res){
    let {country} = req.params;
    if(!country) country = req.query.country; 
    let result = countriesCrud.consultCountries(country);
    result.then((countries)=>{
        let response = {
            result: countries,
            links: links(req,countries)
        };
        res.send(response);
    }).catch((err)=>{
        if(typeof err === 'string')  res.status(400).send({problem: err});
        res.status(500).send({error: err.message});
    });  
}


async function postCountries(req, res) {
    res.status(405).send('The action is not allowed.');    
}

async function deleteCountries(req, res){
    if(!req.params.country) 
    return  res.status(400).send(ct.ERROR_NO_DATA);

    countriesCrud.deleteCountry(req.params.country).then((result)=>{
        let response = {    
            result: result,
            links: links(req,result)
        }
        res.send(response);
    },(err)=>{
        if(typeof err === 'string')  res.status(400).send({problem: err});
        res.status(500).send({error: err.message});
    });   
}

async function putCountries(req, res) {
    if(!req.params.country || !req.body.name) 
        return res.status(400).send(ct.ERROR_NO_DATA);
    countriesCrud.updateCountry(req.params.country, req.body.name).then((result)=>{
        let response = {
            result: result,
            links: links(req,result)
        }
        res.send(response);
    }).catch((err)=>{
        if(typeof err === 'string')  res.status(400).send({problem: err});
        res.status(500).send({error: err.message});
    });
}

function links(req,result){
    // getThisCountry:`${req.protocol}://${req.hostname}/countries/${result.country || finded[0].country}/${result.country || finded[0].code}`,
    return {
        getAllCountries: `${req.protocol}://${req.hostname}/countries`,
        getCountryCountries:`${req.protocol}://${req.hostname}/countries/:country`,
        putCountries:`${req.protocol}://${req.hostname}/countries/:country (body:{name})`,
        deleteCountries:`${req.protocol}://${req.hostname}/countries/:country/`
    }
}

module.exports = routerCountries;