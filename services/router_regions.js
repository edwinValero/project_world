const express = require("express");
const routerRegions = express.Router();
const regionsCrud = require('../data_base/region_crud.js');
const ct = require('../data_base/constants');
const logger = require('./logger');


routerRegions.get("/", consultRegionsGet); 
routerRegions.get("/:country", consultRegionsGet);
routerRegions.get("/:country/:region",consultRegionsGet);
routerRegions.post("/:country", postRegions);
routerRegions.delete("/:country/:region",deleteRegions );
routerRegions.put("/:country/:region",putRegions);


async function consultRegionsGet(req, res){
    let {country, region} = req.params;
    if(!country) country = req.query.country; 
    if(!region) region = req.query.region;
    let result = regionsCrud.consultRegions(region, country);
    result.then((regions)=>{
        let response = {
            result: regions,
            links: links(req,regions)
        };
        res.send(response);
    }).catch((err)=>{
        logger.info(err);
        res.status(500).send({error: err.message});
    });  
}


async function postRegions(req, res) {
    let { region, name} = req.body;
    if(!req.params.country || !region || !name) return res.status(400).send(ct.ERROR_NO_DATA);
    regionsCrud.createRegion(req.body, req.params.country).then((result)=>{
        let response = {
            result: result,
            links: links(req,result)
        }
        res.status(201).send(response);
    }).catch((err)=>{
        res.status(500).send({error: err.message});
    });
    
}

async function deleteRegions(req, res){
    if(!req.params.country || ! req.params.region) return  res.status(400).send(ct.ERROR_NO_DATA);
    regionsCrud.deleteRegion(req.params.country, req.params.region).then((result)=>{
        let response = {    
            result: result,
            links: links(req,result)
        }
        res.send(response);
    },(err)=>{
        res.status(500).send({error: err.message});
    });   
}

async function putRegions(req, res) {
    if(!req.params.country || !req.params.region || !req.body.name) 
        return res.status(400).send(ct.ERROR_NO_DATA);
    regionsCrud.updateRegion(req.params.country, req.params.region, req.body.name).then((result)=>{
        let response = {
            result: result,
            links: links(req,result)
        }
        res.send(response);
    }).catch((err)=>{
        res.status(500).send({error: err.message});
    });
}

function links(req,result){
    // getThisRegion:`${req.protocol}://${req.hostname}/regions/${result.country || finded[0].country}/${result.region || finded[0].code}`,
    return {
        getAllRegions: `${req.protocol}://${req.hostname}/regions`,
        getCountryRegions:`${req.protocol}://${req.hostname}/regions/:country`,
        postRegions:`${req.protocol}://${req.hostname}/regions/:country (body:{region,name})`,
        putRegions:`${req.protocol}://${req.hostname}/regions/:country/:region (body:{name})`,
        deleteRegions:`${req.protocol}://${req.hostname}/regions/:country/:region`
    }
}

module.exports = {
    router :routerRegions,
    consultRegionsGet: consultRegionsGet
};