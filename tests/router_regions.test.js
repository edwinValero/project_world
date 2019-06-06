jest.mock('../data_base/region_crud');
let crud, {consultRegions} = require('../data_base/region_crud');
const mockRes = require('node-mocks-http');
const router = require('../services/router_regions');

describe('test of consultRegionsGet ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        consultRegions.mockReturnValue(Promise.resolve({ 
            code: '1234',
            country: 'CO',
            name : 'testMockConsult'
        }));
        req = { params:{ country:'CO', region :1} };
        mockResponse = new mockRes.createResponse();

    });

    afterEach(()=>{
        mockResponse.statusCode = '';
    });

    it('consultRegionsGet ', async ()=>{
        return router.consultRegionsGet(req,mockResponse).then(() =>{
            console.log(mockResponse.Body);
            expect(mockResponse.statusCode).toBe(200);
        }).catch(err=>{
            throw new Error(err);
        });
    });

    
});