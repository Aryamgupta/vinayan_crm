const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addProduct, editProduct, deleteProduct, recalculateCost, getAllProducts, getSingleProduct } = require("../Controllers/finalProductControllers");

const router = express.Router();

router.route("/add").post(protect,addProduct);
router.route("/edit").put(protect,editProduct);
router.route("/:id").get(protect,deleteProduct);
router.route("/").get(protect,recalculateCost);
router.route("/allotMaterial/:id").put(protect,getAllProducts);
router.route("/edit/:id").put(protect,getAllProducts);
router.route("/:id").get(protect,getSingleProduct);

module.exports = router;