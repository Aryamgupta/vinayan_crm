const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addEmplyee, getEmplyee, getAllEmplyee, allocateMaterial, deAllocateMaterial } = require("../Controllers/employeeControllers");

const router = express.Router();

router.route("/add").post(protect,addEmplyee);
// router.route("/:empId").put(protect,editProduct);
router.route("/:empId").get(protect,getEmplyee);
router.route("/").get(protect,getAllEmplyee);
router.route("/allotMaterial/:empId").put(protect,allocateMaterial);
router.route("/deAllocateMaterial/:empId").put(protect,deAllocateMaterial);

module.exports = router;