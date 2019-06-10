jest.mock('../../data_base/city_crud');
let crud = require('../../data_base/city_crud');
const mockRes = require('node-mocks-http');
const controller = require('../../controllers/controller_cities');

describe('test of consultCities ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets consultCities  when crud return data and params in req', async ()=>{
        crud.consultCitiesAndSisters.mockReturnValue(Promise.resolve({ 
            code: '1234',
            country: 'CO',
            name : 'testMockConsult'
        }));
        req = { params:{ city:23}, body: {region: 1, country:'CO'} };

        return controller.consultCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(200);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets consultCities  when no params in req', async ()=>{
        crud.consultCitiesAndSisters.mockReturnValue(Promise.reject('Texto de error'));
        req = { params:{ citys:23}, body: {regions: 1, countrys:'CO'} };

        return controller.consultCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(400);
            expect(mockResponse.body).toBe('Insufficient data');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets consultCities  when crud throw string  and query in req', async ()=>{
        crud.consultCitiesAndSisters.mockReturnValue(Promise.reject('Texto de error'));
        req = { params:{ city:23}, body: {region: 1, country:'CO'} };

        return controller.consultCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });

    it('tets consultCities  when crud throw exception and query in req', async ()=>{
        crud.consultCitiesAndSisters.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ city:23}, body: {region: 1, country:'CO'} };

        return controller.consultCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});

describe('test of postCities ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets postCities  when crud return data and params in req', async ()=>{
        crud.createCity.mockReturnValue(Promise.resolve({ 
            code: '1234'
        }));
        req = { params:{ city:12}, body: {country:'CO', region :1} };

        return controller.postCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(201);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets postCities  when no params in req', async ()=>{
        crud.createCity.mockReturnValue(Promise.reject('Texto de error'));
        req = { params:{ citys:12}, body: {country:'CO', region :1} };

        return controller.postCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(400);
            expect(mockResponse.body).toBe('Insufficient data');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets postCities  when throw crud with string', async ()=>{
        crud.createCity.mockReturnValue(Promise.reject('Error text'));
        req = { params:{ city:12}, body: {country:'CO', region :1} };

        return controller.postCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
            expect(mockResponse.body.problem).toBe( "Error text");
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets postCities  when crud throw exception ', async ()=>{
        crud.createCity.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ city:12}, body: {country:'CO', region :1} };

        return controller.postCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});

describe('test of deleteCities ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets deleteCities  when crud return data and params in req', async ()=>{
        crud.deleteCity.mockReturnValue(Promise.resolve({ 
            code: '1234'
        }));
        req = { params:{city:12 }, body:{country:'CO',region :1}};

        return controller.deleteCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(204);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets deleteCities  when no params in req', async ()=>{
        crud.deleteCity.mockReturnValue(Promise.reject('Texto de error'));
        req = { params:{citys:12 }, body:{countrys:'CO',regions :1}};

        return controller.deleteCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(400);
            expect(mockResponse.body).toBe('Insufficient data');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets deleteCities  when throw crud with string', async ()=>{
        crud.deleteCity.mockReturnValue(Promise.reject('Error text'));
        req = { params:{city:12 }, body:{country:'CO',region :1}};

        return controller.deleteCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
            expect(mockResponse.body.problem).toBe( "Error text");
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets deleteCities  when crud throw exception ', async ()=>{
        crud.deleteCity.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{city:12 }, body:{country:'CO',region :1}};

        return controller.deleteCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});

describe('test of putCities ', ()=>{
    let mockResponse, req;
    beforeEach(() => {
        mockResponse = new mockRes.createResponse();
        mockResponse.send=result=>{ mockResponse.body=result};
        mockResponse.statusCode = '';
    });

    it('tets putCities  when crud return data and params in req', async ()=>{
        crud.updateCity.mockReturnValue(Promise.resolve({ 
            code: '1234'
        }));
        req = { params:{ city:12}, body: {country:'CO', region :1} };

        return controller.putCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(200);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });


    it('tets putCities  when no params in req', async ()=>{
        crud.updateCity.mockReturnValue(Promise.reject('Texto de error'));
        req = { params:{ citys:12}, body: {countrys:'CO', regions :1} };

        return controller.putCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(400);
            expect(mockResponse.body).toBe('Insufficient data');
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });

    });

    it('tets putCities  when throw crud with string', async ()=>{
        crud.updateCity.mockReturnValue(Promise.reject('Error text'));
        req = { params:{ city:12}, body: {country:'CO', region :1} };

        return controller.putCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(409);
            expect(mockResponse.body.problem).toBe( "Error text");
        }).catch(err=>{
           console.log(err);            
           throw new Error(err);
        });

    });

    it('tets putCities  when crud throw exception ', async ()=>{
        crud.updateCity.mockReturnValue(Promise.reject(new Error('Texto exception')));
        req = { params:{ city:12}, body: {country:'CO', region :1} };

        return controller.putCities(req,mockResponse).then(() =>{
            expect(mockResponse.statusCode).toBe(500);
        }).catch(err=>{
           console.log(err);             
           throw new Error(err);
        });
    });  
});