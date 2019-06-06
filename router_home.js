const express = require("express");
const routerHome = express.Router();

const routerCountries= require("./services/router_countries");
const routerRegions = require("./services/router_regions.js");
const routerCities = require("./services/router_cities.js");
const routerSisters = require("./services/router_sisters.js");

routerHome.use("/countries", routerCountries);
routerHome.use("/regions", routerRegions);
routerHome.use("/cities", routerCities);
routerHome.use("/sisters", routerSisters);

module.exports = routerHome;