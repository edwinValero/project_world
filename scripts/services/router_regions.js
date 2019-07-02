const express = require("express");
const routerRegions = express.Router();
const regionsCtrl = require('../controllers/controller_regions');

routerRegions.get("/", regionsCtrl.consultRegionsGet); 
routerRegions.get("/:country", regionsCtrl.consultRegionsGet);
routerRegions.get("/:country/:region",regionsCtrl.consultRegionsGet);
routerRegions.post("/:country", regionsCtrl.postRegions);
routerRegions.delete("/:country/:region",regionsCtrl.deleteRegions );
routerRegions.put("/:country/:region",regionsCtrl.putRegions);

module.exports =routerRegions;