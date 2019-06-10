jest.mock('../../data_base/sisters_crud');
let crud = require('../../data_base/sisters_crud');
const mockRes = require('node-mocks-http');
const controller = require('../../controllers/controller_sisters');

describe('test of consultSistersGet ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.statusCode = '';
    });

    it('tets consultSistersGet  when crud return data and params in req', async ()=>{
        crud.consultSisters.mockReturnValue(Promise.resolve({ 
            code: '1234'
        }));
        req = { params:{ city1:12, city2 :1} };

        return controller.consultSistersGet(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(200);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets consultSistersGet  when crud throw string  and query in req', async ()=>{
        crud.consultSisters.mockReturnValue(Promise.reject('Texto de error'));
        req = { params:{ city1:12, city2 :1} };

        return controller.consultSistersGet(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });
    it('tets consultSistersGet  when crud throw exception and query in req', async ()=>{
        crud.consultSisters.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ city1:12, city2 :1} };

        return controller.consultSistersGet(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});

describe('test of postSister ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets postSister  when crud return data and params in req', async ()=>{
        crud.createSister.mockReturnValue(Promise.resolve({ 
            code: '1234'
        }));
        req = { params:{ city1:12, city2 :1} };

        return controller.postSister(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(201);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets postSister  when throw crud with string', async ()=>{
        crud.createSister.mockReturnValue(Promise.reject('Error text'));
        req = { params:{ city1:12, city2 :1} };

        return controller.postSister(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
            expect(mockResponse.body.problem).toBe( "Error text");
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets postSister  when crud throw exception ', async ()=>{
        crud.createSister.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ city1:12, city2 :1} };

        return controller.postSister(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});

describe('test of deleteSister ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets deleteSister  when crud return data and params in req', async ()=>{
        crud.deleteSister.mockReturnValue(Promise.resolve({ 
            code: '1234'
        }));
        req = { params:{ city1:12, city2 :1} };

        return controller.deleteSister(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(204);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets deleteSister  when throw crud with string', async ()=>{
        crud.deleteSister.mockReturnValue(Promise.reject('Error text'));
        req = { params:{ city1:12, city2 :1} };

        return controller.deleteSister(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
            expect(mockResponse.body.problem).toBe( "Error text");
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets deleteSister  when crud throw exception ', async ()=>{
        crud.deleteSister.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ city1:12, city2 :1} };

        return controller.deleteSister(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});
