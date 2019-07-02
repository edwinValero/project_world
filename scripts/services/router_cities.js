const express = require("express");
const routerCities = express.Router();
const citiesContrl = require('../controllers/controller_cities');

routerCities.get("/:city", citiesContrl.consultCities);
routerCities.get("/",citiesContrl.consultCities);
routerCities.delete("/", citiesContrl.deleteCities);
routerCities.delete("/:city", citiesContrl.deleteCities);
routerCities.post("/:city",citiesContrl.postCities );
routerCities.put("/:city", citiesContrl.putCities);

module.exports = routerCities;