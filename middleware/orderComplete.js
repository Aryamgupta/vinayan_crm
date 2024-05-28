const Order = require("../Models/orderModel");
const asyncHandler = require("express-async-handler");

const checkOrderComplete = asyncHandler(async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate("productDetails")
      .populate({
        path: "productDetails",
        populate: {
          path: "productMaterialList.materialKey",
          model: "Material",
        },
      })
      .populate("extraMaterialNeeded.materialKey");

    if (order.status === "Completed") {
      res.status(200).json(order);
    } else {
      next();
    }
  } catch (error) {
    res.status(401);
    throw new Error("Something Went wrong");
  }
});

module.exports = { checkOrderComplete };
