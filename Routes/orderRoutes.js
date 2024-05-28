const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addOrder, checkInventarStatus,allotMaterial, addExtraMaterials, markCompleteStatus, calculateOrderCost, deleteOrder, getOrders, getOrderDetailsById } = require("../Controllers/orderControllers");
const { checkOrderComplete } = require("../middleware/orderComplete");

const router = express.Router();

// add order 
// edit order
// delete order
// check inventary status
// allot material
// add extra material
// calcultate overall cost
// update complelete status

router.route("/addOrder").post(protect,addOrder);
// router.route("/editOrder").put(protect,editProduct);
router.route("/deleteOrder/:id").delete(protect,deleteOrder);
router.route("/checkInventaryStatus/:id").put(protect,checkOrderComplete,checkInventarStatus);
router.route("/allotMaterial/:id").put(protect,checkOrderComplete,allotMaterial);
router.route("/addExtraMaterials/:id").put(protect,checkOrderComplete,addExtraMaterials);
router.route("/markCompleted/:id").put(protect,checkOrderComplete,markCompleteStatus);
router.route("/calculateOrderCost/:id").put(protect,calculateOrderCost);
router.route("/:id").get(protect,getOrderDetailsById);
router.route("/").get(protect,getOrders);

module.exports = router;