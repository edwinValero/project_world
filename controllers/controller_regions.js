const regionsCrud = require('../data_base/region_crud.js');
const ct = require('../data_base/constants');


async function consultRegionsGet(req, res){
    let {country, region} = req.params;
    if(!country) country = req.query.country; 
    if(!region) region = req.query.region;
    return regionsCrud.consultRegions(region, country).then((regions)=>{        
        let response = {
            result: regions,
            links: links(req,regions)
        };
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(400).send({problem: err});
        res.status(500).send({error: err.message});
    });  
}


async function postRegions(req, res) {
    let { region, name} = req.body;
    if(!req.params.country || !region || !name) return res.status(400).send(ct.ERROR_NO_DATA);
    return regionsCrud.createRegion(req.body, req.params.country).then((result)=>{
        let response = {
            result: result,
            links: links(req,result)
        }
        res.status(201).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(400).send({problem: err});
        res.status(500).send({error: err.message});
    });
    
}

async function deleteRegions(req, res){
    if(!req.params.country || ! req.params.region) return  res.status(400).send(ct.ERROR_NO_DATA);
    return regionsCrud.deleteRegion(req.params.country, req.params.region).then(result=>{
        let response = {    
            result: result,
            links: links(req,result)
        }
        res.status(204).send(response);
    },err=>{
        if(typeof err === 'string')  return res.status(400).send({problem: err});
        res.status(500).send({error: err.message});
    });   
}

async function putRegions(req, res) {
    if(!req.params.country || !req.params.region || !req.body.name) 
        return res.status(400).send(ct.ERROR_NO_DATA);
    return regionsCrud.updateRegion(req.params.country, req.params.region, req.body.name).then((result)=>{
        let response = {
            result: result,
            links: links(req,result)
        }
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(400).send({problem: err});
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
    postRegions: postRegions,
    deleteRegions: deleteRegions,
    putRegions :putRegions,
    consultRegionsGet: consultRegionsGet
};