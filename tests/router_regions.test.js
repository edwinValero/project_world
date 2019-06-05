jest.mock('../data_base/region_crud');

const router = require('../services/router_regions');

describe('test of consultRegionsGet ', ()=>{
    let res, req;

    beforeEach(() => {
        req = { params:{ country:'CO', region :1} };
        res = {
            result : '',
            send: (response)=>{ this.result = response;} 
        };
    });

    it('consultRegionsGet ', async ()=>{
        return router.consultRegionsGet(req,res).then(result =>{
            console.log('Entro');
            expect(res.result).toBe('testMockConsult');
        }).catch(err=>{
            console.log('error!!!!', err);
            throw new Error('I have failed you, Anakin');
        });
    });

    
});