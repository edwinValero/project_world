const countriesCrud = require('../data_base/country_crud.js');
const ct = require('../data_base/constants');

async function consultCountriesGet(req, res){
    let {country} = req.params;
    if(!country) country = req.query.country; 
    return countriesCrud.consultCountries(country).then((countries)=>{
        let response = {
            result: countries,
            links: links(req,{country: country})
        };
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string')  return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });  
}


async function postCountries(req, res) {
    res.status(405).send('The action is not allowed.');    
}

async function deleteCountries(req, res){
    if(!req.params.country) return  res.status(400).send(ct.ERROR_NO_DATA);

    return countriesCrud.deleteCountry(req.params.country).then(()=>{
        res.status(204).send();
    },err=>{
        if(typeof err === 'string') return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });   
}

async function putCountries(req, res) {
    if(!req.params.country || !req.body.name) return res.status(400).send(ct.ERROR_NO_DATA);

    return countriesCrud.updateCountry(req.params.country, req.body.name).then((result)=>{
        let response = {
            result: result,
            links: links(req,{country:req.params.country })
        }
        res.status(200).send(response);
    }).catch((err)=>{
        if(typeof err === 'string') return res.status(409).send({problem: err});
        res.status(500).send({error: err.message});
    });
}

function links(req,data){
    let country = data.country || ':country';
    let root =`${req.protocol}://${req.hostname}:8080`;
    let getCountry= `getCountry: ${root}/countries/${country} (body:{country: ${country}}`;
    let getCountries= `getCountries: ${root}/countries `;
    let putCountry= `putCountry: ${root}/countries/${country} (body:{ name})`;
    let deleteCountry= `deleteCountry: ${root}/countries/${country}`;
    let result=[];
    switch(req.method){
        case 'GET':
            result.push(putCountry);
            result.push(deleteCountry);
            break;
        case 'PUT':
            result.push(getCountry);
            result.push(getCountries);
            result.push(deleteCountry);
            break;
        default:
            result = undefined;
            break;
    }
    return result;
}

module.exports = {
    consultCountriesGet:consultCountriesGet,
    putCountries:putCountries,
    deleteCountries:deleteCountries,
    postCountries:postCountries
};