const util = require('util');
let promisify = jest.spyOn(util, ['promisify']);
jest.mock('../../data_base/connection');
jest.mock('../../services/logger');
jest.mock('../../data_base/city_crud');
let connection = require('../../data_base/connection');
const crud = require('../../data_base/sisters_crud');
const city_crud = require('../../data_base/city_crud');
const QR_SISTERS_SELECT = `select * from world_project_db.sisters`;
const QR_SISTERS_INSERT = `INSERT INTO  world_project_db.sisters`;
const QR_SISTERS_DELETE = `DELETE FROM world_project_db.sisters`;
const QR_SISTERS_UPDATE = `UPDATE world_project_db.sisters`;

describe('test of consultSisters ', ()=>{
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });

    it('test consultSisters  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_SISTERS_SELECT) ) return  Promise.resolve([{code:2}]);
        });
        city_crud.consultSeveralCities = ()=>Promise.resolve([{code:2},{code:1}]);

        return crud.consultSisters(1,2).then(result =>{
            expect('code:'+result[0].code).toBe('code:2');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test consultSisters  when query returns with one param', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_SISTERS_SELECT) ) return  Promise.resolve([{code:2}]);
        });
        city_crud.consultSeveralCities = ()=>Promise.resolve([{code:2}]);

        return crud.consultSisters(1).then(result =>{
            expect('code:'+result[0].code).toBe('code:2');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test consultSisters  when cities do not exist', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_SISTERS_SELECT) ) return  Promise.resolve([{code:2}]);
        });
        city_crud.consultSeveralCities = ()=>Promise.resolve([]);

        return crud.consultSisters(1,2).then(result =>{
            console.log(result);             
            throw new Error(result);
        }).catch(err=>{
            expect(err).toBe('One or more cities do not exist');
        });
    });

    it('test consultSisters  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{    
            throw new Error('Error with promisify');
        });
        city_crud.consultSeveralCities = ()=>Promise.resolve([{code:1},{code:2}]);

        return crud.consultSisters(1,2).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
           expect(err.message).toBe('Error: Error with promisify');
        });
    });
});

describe('test of createSister ', ()=>{
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });

    it('test createSister  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_SISTERS_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_SISTERS_INSERT) ) return  Promise.resolve({result:1});
        });
        city_crud.consultSeveralCities = ()=>Promise.resolve([{code:2},{code:1}]);
        return crud.createSister(1, 2).then(result =>{
            expect(result.message).toBe('Sister cities created in the database');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test createSister  when params is wrong', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_SISTERS_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_SISTERS_INSERT) ) return  Promise.resolve({result:1});
        });
        return crud.createSister().then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err).toBe('Insufficient data');
        });
    });

    it('test createSister  when sisters exists', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_SISTERS_SELECT) ) return  Promise.resolve([{city1:1, city2:2}]);
            if(value.includes(QR_SISTERS_INSERT) ) return  Promise.resolve({result:1});
        });

        city_crud.consultSeveralCities = ()=>Promise.resolve([{code:2},{code:1}]);

        return crud.createSister(1, 2).then(result =>{
            console.log(result);             
            throw new Error(result);
        }).catch(err=>{
            expect(err).toBe('The cities are already sisters');          
        });
    });

    it('test createSister  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{   
            if(value.includes(QR_SISTERS_SELECT) ) return Promise.resolve([]);
            throw new Error('Error with promisify');
        });

        city_crud.consultSeveralCities = ()=>Promise.resolve([{code:2},{code:1}]);

        return crud.createSister(2, 1).then(result =>{ 
            throw new Error('Error no catch');
        }).catch(err=>{
           expect(err.message).toBe('Error: Error with promisify');
        });
    });
});

describe('test of deleteSister ', ()=>{
    beforeEach(() => {        
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });

    it('test deleteSister  when query returns', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_SISTERS_SELECT) ) return  Promise.resolve([{city1:1, city2:2}]);
            if(value.includes(QR_SISTERS_DELETE) ) return  Promise.resolve({result:1});
        });
        city_crud.consultCities = ()=>Promise.resolve([{code:2},{code:1}]);

        return crud.deleteSister(2 ,1).then(result =>{
            expect(result.message).toBe('Cities relationship was deleted');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test deleteSister  when cities relationship does not exist', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_SISTERS_SELECT) ) return  Promise.resolve([]);
            if(value.includes(QR_SISTERS_DELETE) ) return  Promise.resolve({result:1});
        });
        city_crud.consultCities = ()=>Promise.resolve([{code:2},{code:1}]);

        return crud.deleteSister(1,2).then(result =>{
            expect(result).toBe('Cities relationship does not exist');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('test deleteSister  when throw something', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_SISTERS_SELECT) ) return  Promise.resolve([{city1:1, city2:2}]);
            throw new Error('Error with promisify');
        });
        city_crud.consultCities = ()=>Promise.resolve([{code:2},{code:1}]);

        return crud.deleteSister(1,2).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
           expect(err.message).toBe('Error: Error with promisify');
        });
    });

    it('test deleteSister  when params is wrong', async ()=>{
        promisify.mockReturnValue((value)=>{    
            if(value.includes(QR_SISTERS_SELECT) ) return  Promise.resolve([{city1:1, city2:2}]);
            throw new Error('Error with promisify');
        });
        city_crud.consultCities = ()=>Promise.resolve([{code:2},{code:1}]);

        return crud.deleteSister(1).then(result =>{
            throw new Error('Error no catch');
        }).catch(err=>{
            expect(err).toBe('Insufficient data');
        });
    });
});
