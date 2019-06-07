jest.mock('util');
jest.mock('../../data_base/connection');
jest.mock('../../services/logger');
let {promisify} = require('util');
let connection = require('../../data_base/connection');
const crud = require('../../data_base/city_crud');

describe('test of consultCitiesAndSisters ', ()=>{
    beforeEach(() => {
        connection.mockReturnValue(Promise.resolve({query:()=>8}));
    });

    it('tets consultCitiesAndSisters  when query returns', async ()=>{
        promisify.mockReturnValue(()=>Promise.resolve([1]));

        return crud.consultCitiesAndSisters(1).then(result =>{
            console.log(result);
            expect(result).toBe(200);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });
});
