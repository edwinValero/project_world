const sistersCrud = require('../data_base/sisters_crud');

async function consultSistersGet(req, res){
    let {city1, city2} = req.params;
    return sistersCrud.consultSisters(city1, city2).then((regions)=>{
        let response = {
            result: regions,
            links: links(req,regions)
        };
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string')  return res.status(400).send({problem: err});
        res.status(500).send({error: err.message});
    });  
}

async function postSister(req, res) {
    let {city1, city2} = req.params;
    return sistersCrud.createSister(city1, city2).then((result)=>{
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

async function deleteSister(req, res) {
    let {city1, city2} = req.params;
    return sistersCrud.deleteSister(city1, city2).then((result)=>{
        let response = {
            result: result,
            links: links(req,result)
        }
        res.status(204).send(response);
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
    consultSistersGet:consultSistersGet,
    deleteSister :deleteSister,
    postSister:postSister
};