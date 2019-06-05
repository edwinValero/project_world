
function consultRegions(code, country){
    return Promise.resolve({ 
        code: '1234',
        country: 'CO',
        name : 'testMockConsult'
    });
}


module.exports= {
    consultRegions: consultRegions
}