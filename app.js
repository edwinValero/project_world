const express = require("express");
const app = express();
const myRouter = require("./router_home.js");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Middleware
function logger(req, res, next){
    console.log(`
    ===  LOG  ===
    ${new Date()}
    ${req.method}
    ${req.protocol}://${req.hostname}${req.path}
    Queries: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    Json: ${JSON.stringify(req.body)}
    `);   
    next(); 
}
app.use(logger);

app.use("/", myRouter);

app.use(( req, res, next)=>{
    res.status(405).send('The action is not allowed.');
});
app.use((err, req, res, next) => {
    console.error("Error....", err.message);
    res.status(500).send("INTERNAL SERVER ERROR");
});
app.listen(8080, () =>
console.log("Routing ready")
);