const express = require("express");
const app = express();
const logger = require('./services/logger');
const myRouter = require("./router_home.js");
const bodyParser = require("body-parser");
const loggerMiddleware = require('./middleware/logger');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use("/", myRouter);

app.use((err, req, res, next) => {
    logger.error("Error....", err.message);
    res.status(500).send("INTERNAL SERVER ERROR");
});
app.listen(8080, () =>
logger.info("Routing ready")
);