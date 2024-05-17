const express = require("express");
let router = express.Router();

const itemController = require("../controllers/itemController");

router.get("/", itemController.listAll);

module.exports = router;