const express = require("express");
let router = express.Router();

const itemController = require("../controllers/itemController");

router.get("/", itemController.listAll);

router.get("/create", itemController.createGet);
router.post("/create", itemController.createPost);

router.get("/:id/delete", itemController.deleteGet);
router.post("/:id/delete", itemController.deletePost);

router.get("/:id/update", itemController.updateGet);
router.post("/:id/update", itemController.updatePost);

router.get("/:id", itemController.showDetails);

module.exports = router;