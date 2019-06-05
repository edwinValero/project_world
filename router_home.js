const express = require("express");
const routerHome = express.Router();

const routerCountries= require("./services/router_countries.js");
const routerRegions = require("./services/router_regions.js");
const routerCities = require("./services/router_cities.js");

routerHome.use("/countries", routerCountries);
routerHome.use("/regions", routerRegions.router);
routerHome.use("/cities", routerCities);

module.exports = routerHome;