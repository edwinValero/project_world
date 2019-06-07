const util = require('util');
let promisify = jest.spyOn(util, ['promisify']);
jest.mock('../../data_base/connection');
jest.mock('../../services/logger');
let connection = require('../../data_base/connection');
const crud = require('../../data_base/city_crud');
const QR_CITY_SELECT = `select * from world_project_db.cities c`;
const QR_CITY_INSERT = `INSERT INTO  world_project_db.cities`;
const QR_CITY_DELETE = `DELETE FROM world_project_db.cities`;
const QR_CITY_UPDATE = `UPDATE world_project_db.cities`;
const QR_SISTERS = `select * from world_project_db.sisters`;

describe('test of consultCitiesAndSisters ', ()=>{
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });

    it('tets consultCitiesAndSisters  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_SISTERS) ) return Promise.resolve([{city1:2, city2:3}]);
        });

        return crud.consultCitiesAndSisters(1).then(result =>{
            expect('code:'+result[0].code+'sister:'+result[0].sisters[0].city1).toBe('code:2sister:2');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets consultCitiesAndSisters  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve({code:2});
            if(value.includes(QR_SISTERS) ) return Promise.resolve([{city1:2, city2:3}]);
        });
        return crud.consultCitiesAndSisters(1,1,1).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
           expect(err.message).toBe('TypeError: cities.map is not a function');
        });
    });

    it('tets consultCitiesAndSisters  when not parameters', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_SISTERS) ) return Promise.resolve([{city1:2, city2:3}]);
        });
        return crud.consultCitiesAndSisters().then(result =>{
            expect(result).toBe('Insufficient data');
        }).catch(err=>{
            console.log(err);             
            throw new Error(err);
        });
    });
});

describe('test of consultSeveralCities ', ()=>{
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });

    it('tets consultSeveralCities  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([{code:2}]);
        });

        return crud.consultSeveralCities([1]).then(result =>{
            expect('code:'+result[0].code).toBe('code:2');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets consultSeveralCities  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{    
            throw new Error('Error with promisify');
        });
        return crud.consultSeveralCities([1]).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
           expect(err.message).toBe('Error: Error with promisify');
        });
    });
});

describe('test of createCity ', ()=>{
    let qrData ;
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
        qrData = {
            code :1,
            region:1,
            country:1,
            name:1,
            latitude:1,
            longitude:1,
            population:1
        }    
    });
    it('tets createCity  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_CITY_INSERT) ) return  Promise.resolve({result:1});
        });

        return crud.createCity(qrData).then(result =>{
            expect(result.message).toBe('City was created');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets createCity  when city exist', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_CITY_INSERT) ) return  Promise.resolve({result:1});
        });
        return crud.createCity(qrData).then(result =>{
            expect(result).toBe('The city already exists');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets createCity  when data is wrong', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_CITY_INSERT) ) return  Promise.resolve({result:1});
        });
        qrData.code = null;
        return crud.createCity(qrData).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err).toBe('Insufficient data');
        });
    });

    it('tets createCity  when throw some thing', async ()=>{
        promisify.mockReturnValue((value)=>{    
            throw new Error('Error with promisify');
        });
        return crud.createCity(qrData).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err.message).toBe('Error: Error with promisify');
        });
    });
});

describe('test of deleteCity ', ()=>{
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });
    it('tets deleteCity  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_CITY_DELETE) ) return  Promise.resolve({result:1});
            if(value.includes(QR_SISTERS) ) return Promise.resolve([]);
        });

        return crud.deleteCity(1,1,1).then(result =>{
            expect(result.message).toBe('The city(ies) was deleted');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets deleteCity  when city not exist', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_CITY_DELETE) ) return  Promise.resolve({result:1});
            if(value.includes(QR_SISTERS) ) return Promise.resolve([]);

        });
        return crud.deleteCity(1,1,1).then(result =>{
            expect(result).toBe('The city does not exist');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets deleteCity  when city has sisters', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_CITY_DELETE) ) return  Promise.resolve({result:1});
            if(value.includes(QR_SISTERS) ) return Promise.resolve([{city1:2}]);
        });

        return crud.deleteCity(1,1,1).then(result =>{
            expect(result).toBe('The city has associated sisters and can not be erased');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets deleteCity  when params are wrong', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_CITY_DELETE) ) return  Promise.resolve({result:1});
            if(value.includes(QR_SISTERS) ) return Promise.resolve([{city1:2}]);
        });
        return crud.deleteCity().then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err).toBe('Insufficient data');
        });
    });

    it('tets deleteCity  when throw some thing', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_SISTERS) ) return Promise.resolve([]);
            throw new Error('Error with promisify');
        });
        return crud.deleteCity(1,1,1).then(result =>{
            console.log(result);
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err.message).toBe('Error: Error with promisify');
        });
    });
});

describe('test of updateCity ', ()=>{
    let qrData ;
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
        qrData = {
            code :1,
            region:1,
            country:1,
            name:1,
            latitude:1,
            longitude:1,
            population:1
        }    
    });
    it('tets updateCity  when update and query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_CITY_UPDATE) ) return  Promise.resolve({result:1});
        });

        return crud.updateCity(qrData).then(result =>{
            expect(result.message).toBe('City was updated');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets updateCity  when create and query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_CITY_UPDATE) ) return  Promise.resolve({result:1});
            if(value.includes(QR_CITY_INSERT) ) return  Promise.resolve({result:1});
        });

        return crud.updateCity(qrData).then(result =>{
            expect(result.message).toBe('City was updated');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets updateCity  when data is wrong', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_CITY_SELECT) ) return  Promise.resolve([{code:2}]);
            if(value.includes(QR_CITY_INSERT) ) return  Promise.resolve({result:1});
        });
        qrData.code = null;
        return crud.updateCity(qrData).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err).toBe('Insufficient data');
        });
    });

    it('tets updateCity  when throw some thing', async ()=>{
        promisify.mockReturnValue((value)=>{    
            throw new Error('Error with promisify');
        });
        return crud.updateCity(qrData).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err.message).toBe('Error: Error with promisify');
        });
    });
});