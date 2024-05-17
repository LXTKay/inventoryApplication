const express = require("express");
let router = express.Router();

const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.listAll);

module.exports = router;