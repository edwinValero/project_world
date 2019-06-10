const util = require('util');
let promisify = jest.spyOn(util, ['promisify']);
jest.mock('../../data_base/connection');
jest.mock('../../services/logger');
jest.mock('../../data_base/city_crud');
let connection = require('../../data_base/connection');
const crud = require('../../data_base/region_crud');
const city_crud = require('../../data_base/city_crud');
const QR_REGION_SELECT = `select * from world_project_db.regions`;
const QR_REGION_INSERT = `INSERT INTO  world_project_db.regions`;
const QR_REGION_DELETE = `DELETE FROM world_project_db.regions`;
const QR_REGION_UPDATE = `UPDATE world_project_db.regions`;

describe('test of consultRegions ', ()=>{
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });

    it('test consultRegions  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([{code:2}]);
        });

        return crud.consultRegions(1,'CO').then(result =>{
            expect('code:'+result[0].code).toBe('code:2');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test consultRegions  when just param code and query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([{code:2}]);
        });

        return crud.consultRegions(1).then(result =>{
            expect('code:'+result[0].code).toBe('code:2');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test consultRegions  when param country', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([{code:2}]);
        });

        return crud.consultRegions(undefined,'CO').then(result =>{
            expect('code:'+result[0].code).toBe('code:2');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test consultRegions  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{    
            throw new Error('Error with promisify');
        });
        return crud.consultRegions(1,'CO').then(result =>{
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
        data = {name:'Name', region:1};
    });

    it('test createRegion  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_REGION_INSERT) ) return  Promise.resolve({result:1});
        });

        return crud.createRegion(data, 'CO').then(result =>{
            expect(result.message).toBe('Region was created');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test createRegion  when params is wrong', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_REGION_INSERT) ) return  Promise.resolve({result:1});
        });
        data = {};
        return crud.createRegion(data, 'CO').then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err).toBe('Insufficient data');
        });
    });

    it('test createRegion  when region exists', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([{code:1}]);
            if(value.includes(QR_REGION_INSERT) ) return  Promise.resolve({result:1});
        });

        return crud.createRegion(data, 1).then(result =>{
           console.log(result);             
           throw new Error(result);
        }).catch(err=>{
            expect(err).toBe('The region already exists');
        });
    });

    it('test createRegion  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([]);
            throw new Error('Error with promisify');
        });
        return crud.createRegion(data, 1).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
           expect(err.message).toBe('Error: Error with promisify');
        });
    });
});

describe('test of deleteRegion ', ()=>{
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });

    it('test deleteRegion  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_REGION_DELETE) ) return  Promise.resolve({result:1});
        });
        city_crud.consultCities = ()=>Promise.resolve([]);

        return crud.deleteRegion(1 ,1).then(result =>{
            expect(result.message).toBe('The region was deleted');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test deleteRegion  when region does not exist', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_REGION_DELETE) ) return  Promise.resolve({result:1});
        });
        city_crud.consultCities = ()=>Promise.resolve([]);

        return crud.deleteRegion(1,1).then(result =>{
            console.log(err);             
            throw new Error(err);
        }).catch(err=>{
            expect(err).toBe('The region does not exist');
        });
    });

    it('test deleteRegion  when region has associated cities', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_REGION_DELETE) ) return  Promise.resolve({result:1});
        });
        city_crud.consultCities = ()=>Promise.resolve([{code:1}]);

        return crud.deleteRegion(1,1).then(result =>{          
           console.log(result);             
           throw new Error(result);
        }).catch(err=>{
            expect(err).toBe('The region has associated cities, it can not be deleted.');
        });
    });

    it('test deleteRegion  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([{code:2}]);
            throw new Error('Error with promisify');
        });
        city_crud.consultCities = ()=>Promise.resolve([]);

        return crud.deleteRegion(1,1).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
           expect(err.message).toBe('Error: Error with promisify');
        });
    });

    it('test deleteRegion  when params is wrong', async ()=>{
       promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_REGION_DELETE) ) return  Promise.resolve({result:1});
        });
        city_crud.consultCities = ()=>Promise.resolve([{code:1}]);

        return crud.deleteRegion(1).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err).toBe('Insufficient data');
        });
    });
});

describe('test of updateRegion ', ()=>{
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });

    it('test updateRegion  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_REGION_UPDATE) ) return  Promise.resolve({result:1});
        });

        return crud.updateRegion(1,1,'name').then(result =>{
            expect(result.message).toBe('The region was updated');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test updateRegion  when region does not exist', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_REGION_UPDATE) ) return  new Error('error');
            if(value.includes(QR_REGION_INSERT) ) return  Promise.resolve({result:1});
        });

        return crud.updateRegion(1,1,'name').then(result =>{
            expect(result.message).toBe('The region was updated');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test updateRegion  when params are wrong', async ()=>{
        promisify.mockReturnValue((value)=>{    
            throw new Error('Error with promisify');
        });

        return crud.updateRegion(1).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err).toBe('Insufficient data');
        });
    });

    it('test updateRegion  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_REGION_SELECT) ) return  Promise.resolve([{code:2}]);
            throw new Error('Error with promisify');
        });

        return crud.updateRegion(1,1,'name').then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
           expect(err.message).toBe('Error: Error with promisify');
        });
    });
});