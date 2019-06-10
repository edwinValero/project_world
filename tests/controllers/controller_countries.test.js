jest.mock('../../data_base/country_crud');
let crud = require('../../data_base/country_crud');
const mockRes = require('node-mocks-http');
const controller = require('../../controllers/controller_countries');

describe('test of consultCountriesGet ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.statusCode = '';
    });

    it('tets consultCountriesGet  when crud return data and params in req', async ()=>{
        crud.consultCountries.mockReturnValue(Promise.resolve({ 
            code: '1234',
            country: 'CO',
            name : 'testMockConsult'
        }));
        req = { params:{ country:'CO'}};

        return controller.consultCountriesGet(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(200);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets consultCountriesGet  when crud throw string  and query in req', async ()=>{

        crud.consultCountries.mockReturnValue(Promise.reject('Texto de error'));
        req = { query:{ country:'CO'}, params:{}};

        return controller.consultCountriesGet(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });
    it('tets consultCountriesGet  when crud throw exception and query in req', async ()=>{
        crud.consultCountries.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ country:'CO'}, query:{}};

        return controller.consultCountriesGet(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});

describe('test of postCountries ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets postCountries to anyway', async ()=>{
        return controller.postCountries(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(405);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });
});

describe('test of deleteCountries ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets deleteCountries  when crud return data and params in req', async ()=>{
        crud.deleteCountry.mockReturnValue(Promise.resolve({ 
            code: '1234'
        }));
        req = { params:{ country:'CO'} };

        return controller.deleteCountries(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(204);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets deleteCountries  when no params in req', async ()=>{

        crud.deleteCountry.mockReturnValue(Promise.reject('Texto de error'));
        req = { params:{ countrys:'CO'} };

        return controller.deleteCountries(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(400);
            expect(mockResponse.body).toBe('Insufficient data');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets deleteCountries  when throw crud with string', async ()=>{

        crud.deleteCountry.mockReturnValue(Promise.reject('Error text'));
        req = { params:{ country:'CO'} };

        return controller.deleteCountries(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
            expect(mockResponse.body.problem).toBe( "Error text");
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets deleteCountries  when crud throw exception ', async ()=>{
        crud.deleteCountry.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ country:'CO'} };

        return controller.deleteCountries(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});

describe('test of putCountries ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets putCountries  when crud return data and params in req', async ()=>{
        crud.updateCountry.mockReturnValue(Promise.resolve({ 
            code: '1234'
        }));
        req = { params:{ country:'CO'}, body : {name:'name'} };

        return controller.putCountries(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(200);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets putCountries  when no params in req', async ()=>{
        crud.updateCountry.mockReturnValue(Promise.reject('Texto de error'));
        req = { params:{ countrys:'CO'}, body : {name:'name'} };

        return controller.putCountries(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(400);
            expect(mockResponse.body).toBe('Insufficient data');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets putCountries  when throw crud with string', async ()=>{
        crud.updateCountry.mockReturnValue(Promise.reject('Error text'));
        req = { params:{ country:'CO'}, body : {name:'name'} };

        return controller.putCountries(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
            expect(mockResponse.body.problem).toBe( "Error text");
        }).catch(err=>{
           console.log(err);            
           throw new Error(err);
        });

    });

    it('tets putCountries  when crud throw exception ', async ()=>{
        crud.updateCountry.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ country:'CO'}, body : {name:'name'} };

        return controller.putCountries(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});