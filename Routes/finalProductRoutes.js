const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addProduct, editProduct, deleteProduct, recalculateCost, getAllProducts, getSingleProduct } = require("../Controllers/finalProductControllers");

const router = express.Router();

router.route("/addProduct").post(protect,addProduct);
router.route("/editProduct").put(protect,editProduct);
router.route("/deleteProduct/:id").delete(protect,deleteProduct);
router.route("/recalculateCost/:id").put(protect,recalculateCost);
router.route("/getAllProducts").get(protect,getAllProducts);
router.route("/:id").get(protect,getSingleProduct);

module.exports = router;