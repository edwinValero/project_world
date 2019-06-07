const util = require('util');
let promisify = jest.spyOn(util, ['promisify']);
jest.mock('../../data_base/connection');
jest.mock('../../services/logger');
jest.mock('../../data_base/region_crud');
let connection = require('../../data_base/connection');
const crud = require('../../data_base/country_crud');
const region_crud = require('../../data_base/region_crud');
const QR_COUNTRY_SELECT = `select * from world_project_db.countries`;
const QR_COUNTRY_INSERT = `INSERT INTO  world_project_db.countries`;
const QR_COUNTRY_DELETE = `DELETE FROM world_project_db.countries`;
const QR_COUNTRY_UPDATE = `UPDATE world_project_db.cities`;

describe('test of consultCountries ', ()=>{
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });

    it('tets consultCountries  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_COUNTRY_SELECT) ) return  Promise.resolve([{code:2}]);
        });

        return crud.consultCountries(1).then(result =>{
            expect('code:'+result[0].code).toBe('code:2');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets consultCountries  when query returns without params', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_COUNTRY_SELECT) ) return  Promise.resolve([{code:2}]);
        });

        return crud.consultCountries().then(result =>{
            expect('code:'+result[0].code).toBe('code:2');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets consultCountries  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{    
            throw new Error('Error with promisify');
        });
        return crud.consultCountries(1).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
           expect(err.message).toBe('Error: Error with promisify');
        });
    });
});

describe('test of createCountry ', ()=>{
    let data;
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
        data = {name:'Name'};
    });

    it('tets createCountry  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_COUNTRY_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_COUNTRY_INSERT) ) return  Promise.resolve({result:1});
        });

        return crud.createCountry(data, 1).then(result =>{
            expect(result.message).toBe('Country was created');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets createCountry  when params is wrong', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_COUNTRY_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_COUNTRY_INSERT) ) return  Promise.resolve({result:1});
        });
        data = {};
        return crud.createCountry(data, 1).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err).toBe('Insufficient data');
        });
    });

    it('tets consultCountries  when country exists', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_COUNTRY_SELECT) ) return  Promise.resolve([{code:1}]);
            if(value.includes(QR_COUNTRY_INSERT) ) return  Promise.resolve({result:1});
        });

        return crud.createCountry(data, 1).then(result =>{
            expect(result).toBe('The country already exists');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets consultCountries  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_COUNTRY_SELECT) ) return  Promise.resolve([]);
            throw new Error('Error with promisify');
        });
        return crud.createCountry(data, 1).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
           expect(err.message).toBe('Error: Error with promisify');
        });
    });
});

describe('test of deleteCountry ', ()=>{
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });

    it('tets deleteCountry  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_COUNTRY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_COUNTRY_DELETE) ) return  Promise.resolve({result:1});
        });
        region_crud.consultRegions = ()=>Promise.resolve([]);

        return crud.deleteCountry( 1).then(result =>{
            expect(result.message).toBe('Country was deleted');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets deleteCountry  when country does not exist', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_COUNTRY_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_COUNTRY_DELETE) ) return  Promise.resolve({result:1});
        });
        region_crud.consultRegions = ()=>Promise.resolve([]);

        return crud.deleteCountry(1).then(result =>{
            expect(result).toBe('The country does not exist');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets deleteCountry  when country has regions', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_COUNTRY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_COUNTRY_DELETE) ) return  Promise.resolve({result:1});
        });
        region_crud.consultRegions = ()=>Promise.resolve([{country:2}]);

        return crud.deleteCountry(1).then(result =>{
            expect(result).toBe('The country has associated regions, it can not be deleted.');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets deleteCountry  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_COUNTRY_SELECT) ) return  Promise.resolve([{code:2}]);
            throw new Error('Error with promisify');
        });
        region_crud.consultRegions = ()=>Promise.resolve([]);

        return crud.deleteCountry(1).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
           expect(err.message).toBe('Error: Error with promisify');
        });
    });
});