const express = require("express");
const routerRegions = express.Router();
const regionsCrud = require('../data_base/region_crud.js');


routerRegions.get("/", async (req, res) => { 
    let regions = await regionsCrud.consultRegions();
    responseGet(regions, res);
    let response = {
        result: regions,
        links:{
            getCountryRegions:'/regions/:country',
            getCountryRegions:'/regions/:country/:code',
            postRegions:`/regions/:country`,

        }
    }
    res.send(response);
 }); 
routerRegions.get("/:country", async (req, res) => {
    let regions = await regionsCrud.consultRegions('',req.params.country);
    responseGet(regions, res);
    res.send(regions);
});
routerRegions.get("/:country/:code", async (req, res) => {
    let regions = await regionsCrud.consultRegions(req.params.code,req.params.country);
    responseGet(regions, res);
    res.send(regions);
});

routerRegions.post("/:country", async (req, res) => {
    let result = await regionsCrud.createRegion(req.body, req.params.country);
    responseErrorPost(result, res);
    res.status(201).send(result);
});

routerRegions.delete("/:country/:region", async (req, res) => {
    let result = await regionsCrud.deleteRegion(req.params.country, req.params.region);
    responseErrorDelete(result, res);
    res.send(result);
});

routerRegions.put("/:country/:region", async (req, res) => {
    let finded = await regionsCrud.consultRegions(req.params.region,req.params.country);
    let result;
    if(finded.length){
        result = await regionsCrud.updateRegion(req.params.country, req.params.region, req.body.name);
        responseErrorDelete(result);
    }else{
        result = await regionsCrud.createRegion({code: req.params.region, name: req.body.name }, req.params.country);
        responseErrorPost(result);
    }
    res.send(result);
});

function responseGet(regions, res){
    if(regions.errno || regions === regionsCrud.errorDB){
        res.status(500).send(regions);
    }
}

function responseErrorPost(regions, res){
    if(regions.error.errno || regions === regionsCrud.errorDB){
        res.status(500).send(regions);
    }else if(regions.error === regionsCrud.errorData){
        res.status(400).send(regions);
    }
}

function responseErrorDelete(result, res){
    if(result.errno || result === regionsCrud.errorDB){
        res.status(500).send(result);
    }else if(result.error === regionsCrud.errorData){
        res.status(400).send(result);
    }
}
module.exports = routerRegions;