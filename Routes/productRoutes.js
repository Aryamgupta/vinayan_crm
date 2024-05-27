const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {  materialIn, materialEdit, getMaterial, materialOut } = require("../Controllers/productController");

const router = express.Router();

router.route("/materialIn").post(protect,materialIn);
router.route("/materialEdit").put(protect,materialEdit);
router.route("/").get(protect,getMaterial);
router.route("/materialOut").put(protect,materialOut);
// router.route("/login").post(authUser);

module.exports = router;