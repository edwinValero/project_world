const sistersCrud = require('../data_base/sisters_crud');

async function consultSistersGet(req, res){
    let {city1, city2} = req.params;
    return sistersCrud.consultSisters(city1, city2).then((regions)=>{
        let response = {
            result: regions,
            links: links(req,{city1:city1, city2:city2})
        };
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string')  return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });  
}

async function postSister(req, res) {
    let {city1, city2} = req.params;
    return sistersCrud.createSister(city1, city2).then((result)=>{
        let response = {
            result: result,
            links: links(req,{city1:city1, city2:city2})
        }
        res.status(201).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });
}

async function deleteSister(req, res) {
    let {city1, city2} = req.params;
    return sistersCrud.deleteSister(city1, city2).then(()=>{
        res.status(204).send();
    }).catch(err=>{
        if(typeof err === 'string') return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });
    
}


function links(req,data){
    let city1 = data.city1 || ':city1';
    let city2 = data.city2 || ':city2';
    let root =`${req.protocol}://${req.hostname}:8080`;
    let getCitySisters= `getCitySisters: ${root}/sisters/${city1}`;
    let getCitiesAreSisters= `getCitiesAreSisters: ${root}/sisters/${city1}/${city2}`;
    let postSisters= `postSisters: ${root}/sisters/${city1}/${city2}`;
    let deleteSisters= `deleteSisters: ${root}/sisters/${city1}/${city2}`;
    let result=[];
    switch(req.method){
        case 'GET':
            result.push(postSisters);
            result.push(deleteSisters);
            break;
        case 'POST':
            result.push(getCitySisters);
            result.push(getCitiesAreSisters);
            result.push(deleteSisters);
            break;
        default:
            result = undefined;
            break;
    }
    return result;
}

module.exports = {
    consultSistersGet:consultSistersGet,
    deleteSister:deleteSister,
    postSister:postSister
};