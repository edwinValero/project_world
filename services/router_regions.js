const express = require("express");
const routerRegions = express.Router();
const regionsCrud = require('../data_base/region_crud.js');
const ct = require('../data_base/constants');
const logger = require('./logger');


routerRegions.get("/", consultRegionsGet); 
routerRegions.get("/:country", consultRegionsGet);
routerRegions.get("/:country/:region",consultRegionsGet);

async function consultRegionsGet(req, res){
    let {country, region} = req.params;
    if(!country) country = req.query.country; 
    if(!region) region = req.query.region;
    logger.info(country+region);
    try{
        let regions = await regionsCrud.consultRegions(region, country);
        let response = {
            result: regions,
            links: links(req,regions)
        };
        res.send(response);
    }catch(err){
        logger.info(err);
        res.status(500).send({error: err.message});
    }   
}

routerRegions.post("/:country", async (req, res) => {
    let { region, name} = req.body;
    if(!req.params.country || !region || !name) return  res.status(400).send(ct.ERROR_NO_DATA);
    try{
        let result = await regionsCrud.createRegion(req.body, req.params.country);
        responseErrorPost(result, res);
        let response = {
            result: result,
            links: links(req,result)
        }
        res.status(201).send(response);
    }catch(err){
        res.status(500).send({error: err});
    }
    
});

routerRegions.delete("/:country/:region", async (req, res) => {
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
});

routerRegions.put("/:country/:region", async (req, res) => {

    if(!req.params.country || !req.params.region || !req.body.name) return  res.status(400).send(ct.ERROR_NO_DATA);
    try{
        let result = await regionsCrud.updateRegion(req.params.country, req.params.region, req.body.name);
        let response = {
            result: result,
            links: links(req,result)
        }
        res.send(response);
    }catch(err){
        res.status(500).send({error: err});
    }
});

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

module.exports = routerRegions;