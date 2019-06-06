const express = require("express");
const routerSisters = express.Router();
const sistersCtrl = require('../controllers/controller_sisters');

routerSisters.get("/:city1", sistersCtrl.consultSistersGet);
routerSisters.get("/:city1/:city2",sistersCtrl.consultSistersGet);
routerSisters.post("/:city1/:city2", sistersCtrl.postSister);
routerSisters.delete("/:city1/:city2", sistersCtrl.deleteSister);

module.exports = routerSisters;