const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getAllAlotments, getAllotById } = require("../Controllers/internalAllotmentControllers");
const { deAllocateMaterial } = require("../Controllers/employeeControllers");

const router = express.Router();

router.route("/").get(protect,getAllAlotments);
router.route("/:allotId").get(protect,getAllotById);
router.route("/").put(protect,deAllocateMaterial);

module.exports = router;