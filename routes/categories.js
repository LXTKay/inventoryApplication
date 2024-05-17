const express = require("express");
let router = express.Router();

const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.listAll);

router.get("/create", categoryController.createGet);
router.post("/create", categoryController.createPost);

router.get("/:id/delete", categoryController.deleteGet);
router.post("/:id/delete", categoryController.deletePost);

router.get("/:id/update", categoryController.updateGet);
router.post("/:id/update", categoryController.updatePost);

router.get("/:id", categoryController.showDetails);

module.exports = router;