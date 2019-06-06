const express = require("express");
const routerCountries = express.Router();
const countriesCtrl = require('../controllers/controller_countries');

routerCountries.get("/", countriesCtrl.consultCountriesGet); 
routerCountries.get("/:country", countriesCtrl.consultCountriesGet);
routerCountries.post("/", countriesCtrl.postCountries);
routerCountries.post("/:country", countriesCtrl.postCountries);
routerCountries.delete("/:country", countriesCtrl.deleteCountries );
routerCountries.put("/:country", countriesCtrl.putCountries);

module.exports = routerCountries;