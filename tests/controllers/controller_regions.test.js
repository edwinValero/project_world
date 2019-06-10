jest.mock('../../data_base/region_crud');
let crud = require('../../data_base/region_crud');
const mockRes = require('node-mocks-http');
const controller = require('../../controllers/controller_regions');

describe('test of consultRegionsGet ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.statusCode = '';
    });

    it('tets consultRegionsGet  when crud return data and params in req', async ()=>{
        crud.consultRegions.mockReturnValue(Promise.resolve({ 
            code: '1234',
            country: 'CO',
            name : 'testMockConsult'
        }));
        req = { params:{ country:'CO', region :1}, query: {} };

        return controller.consultRegionsGet(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(200);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets consultRegionsGet  when crud throw string  and query in req', async ()=>{

        crud.consultRegions.mockReturnValue(Promise.reject('Texto de error'));
        req = { query:{ country:'CO', region :1},params:{} };

        return controller.consultRegionsGet(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });
    it('tets consultRegionsGet  when crud throw exception and query in req', async ()=>{
        crud.consultRegions.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { query:{ country:'CO', region :1}, params:{} };

        return controller.consultRegionsGet(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});

describe('test of postRegions ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets postRegions  when crud return data and params in req', async ()=>{
        crud.createRegion.mockReturnValue(Promise.resolve({ 
            code: '1234'
        }));
        req = { params:{ country:'CO'}, body: {name:'name', region :1} };

        return controller.postRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(201);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets postRegions  when no params in req', async ()=>{

        crud.createRegion.mockReturnValue(Promise.reject('Texto de error'));
        req = { params:{ countrys:'CO'}, body: {name:'name', region :1} };

        return controller.postRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(400);
            expect(mockResponse.body).toBe('Insufficient data');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets postRegions  when throw crud with string', async ()=>{

        crud.createRegion.mockReturnValue(Promise.reject('Error text'));
        req = { params:{ country:'CO'}, body: {name:'name', region :1} };

        return controller.postRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
            expect(mockResponse.body.problem).toBe( "Error text");
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets postRegions  when crud throw exception ', async ()=>{
        crud.createRegion.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ country:'CO'}, body: {name:'name', region :1} };

        return controller.postRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});

describe('test of deleteRegions ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets deleteRegions  when crud return data and params in req', async ()=>{
        crud.deleteRegion.mockReturnValue(Promise.resolve({ 
            code: '1234'
        }));
        req = { params:{ country:'CO',region :1} };

        return controller.deleteRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(204);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets deleteRegions  when no params in req', async ()=>{

        crud.deleteRegion.mockReturnValue(Promise.reject('Texto de error'));
        req = { params:{ countrys:'CO'} };

        return controller.deleteRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(400);
            expect(mockResponse.body).toBe('Insufficient data');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets deleteRegions  when throw crud with string', async ()=>{

        crud.deleteRegion.mockReturnValue(Promise.reject('Error text'));
        req = { params:{ country:'CO',region :1} };

        return controller.deleteRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
            expect(mockResponse.body.problem).toBe( "Error text");
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets deleteRegions  when crud throw exception ', async ()=>{
        crud.deleteRegion.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ country:'CO',region :1} };

        return controller.deleteRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});

describe('test of putRegions ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets putRegions  when crud return data and params in req', async ()=>{
        crud.updateRegion.mockReturnValue(Promise.resolve({ 
            code: '1234'
        }));
        req = { params:{ country:'CO',region :1}, body : {name:'name'} };

        return controller.putRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(200);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets putRegions  when no params in req', async ()=>{
        crud.updateRegion.mockReturnValue(Promise.reject('Texto de error'));
        req = { params:{ countrys:'CO',region :1}, body : {name:'name'} };

        return controller.putRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(400);
            expect(mockResponse.body).toBe('Insufficient data');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets putRegions  when throw crud with string', async ()=>{
        crud.updateRegion.mockReturnValue(Promise.reject('Error text'));
        req = { params:{ country:'CO',region :1}, body : {name:'name'} };

        return controller.putRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
            expect(mockResponse.body.problem).toBe( "Error text");
        }).catch(err=>{
           console.log(err);            
           throw new Error(err);
        });

    });

    it('tets putRegions  when crud throw exception ', async ()=>{
        crud.updateRegion.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ country:'CO',region :1}, body : {name:'name'} };

        return controller.putRegions(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});