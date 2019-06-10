const regionsCrud = require('../data_base/region_crud.js');
const ct = require('../data_base/constants');


async function consultRegionsGet(req, res){
    let {country, region} = req.params;
    if(!country) country = req.query.country; 
    if(!region) region = req.query.region;
    return regionsCrud.consultRegions(region, country).then((regions)=>{        
        let response = {
            result: regions,
            links: links(req,{country:country, region:region})
        };
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });  
}


async function postRegions(req, res) {
    let { region, name} = req.body;
    if(!req.params.country || !region || !name) return res.status(400).send(ct.ERROR_NO_DATA);
    return regionsCrud.createRegion(req.body, req.params.country).then((result)=>{
        let response = {
            result: result,
            links: links(req,{region:region, country:req.params.country})
        }
        res.status(201).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });
    
}

async function deleteRegions(req, res){
    if(!req.params.country || ! req.params.region) return  res.status(400).send(ct.ERROR_NO_DATA);
    return regionsCrud.deleteRegion(req.params.country, req.params.region).then(()=>{
        res.status(204).send();
    },err=>{
        if(typeof err === 'string')  return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });   
}

async function putRegions(req, res) {
    if(!req.params.country || !req.params.region || !req.body.name) 
        return res.status(400).send(ct.ERROR_NO_DATA);
    return regionsCrud.updateRegion(req.params.country, req.params.region, req.body.name).then((result)=>{
        let response = {
            result: result,
            links: links(req,{region:req.params.region, country:req.params.country})
        }
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });
}

function links(req,data){
    let country = data.country || ':country';
    let region = data.region || ':region';
    let root =`${req.protocol}://${req.hostname}:8080`;
    let getRegion= `getRegion: ${root}/regions/${country}/${region}  (body:{region: ${region},country: ${country}}`;
    let getRegionsCountry= `getRegionsCountry: ${root}/regions/${country} (body:{country: ${country}}`;
    let postRegion= `postRegion: ${root}/regions/${country} (body:{region, name} )`;
    let putRegion= `putRegion: ${root}/regions/${country}/${region} (body:{ name})`;
    let deleteRegion= `deleteRegion: ${root}/regions/${country}/${region}`;
    let result=[];
    switch(req.method){
        case 'GET':
            result.push(postRegion);
            result.push(putRegion);
            result.push(deleteRegion);
            break;
        case 'POST':
            result.push(getRegion);
            result.push(getRegionsCountry);
            result.push(putRegion);
            result.push(deleteRegion);
            break;
        case 'PUT':
            result.push(getRegion);
            result.push(getRegionsCountry);
            result.push(postRegion);
            result.push(deleteRegion);
            break;
        default:
            result = undefined;
            break;
    }
    return result;
}

module.exports = {
    postRegions: postRegions,
    deleteRegions: deleteRegions,
    putRegions :putRegions,
    consultRegionsGet: consultRegionsGet
};