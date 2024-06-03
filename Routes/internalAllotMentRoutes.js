const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addProduct, editProduct } = require("../Controllers/finalProductControllers");

const router = express.Router();

router.route("/").get(protect,addProduct);
router.route("/:id").get(protect,editProduct);

module.exports = router;