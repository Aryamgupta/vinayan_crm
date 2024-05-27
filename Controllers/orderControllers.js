const asynchHandler = require("express-async-handler");
const Product = require("../Models/productModel");
const Material = require("../Models/materialMode");
const Order = require("../Models/orderModel");

// @description   to add a product in the list
// @route   POST /api/finalProduct/addProduct
// @access  protected
const addOrder = asynchHandler(async (req, res) => {
  const { customerName, productDetails, productQuantity } = req.body;
  //   let matLis = JSON.parse(materialList);

  if (!customerName || !productDetails || !productQuantity) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const product = await Product.findById(productDetails);

  let materialCost = product.approximateMaterialCost * productQuantity;

  // pdt.productMaterialList.forEach(async (pMat) => {
  //   const mat = await Material.findById(pMat.materialKey);
  //   let matQuanNeeded = productQuantity * pMat.quantity;
  //   console.log(matQuanNeeded);
  //   if (matQuanNeeded <= mat.pdtQuantity) {
  //     await Material.findByIdAndUpdate(pMat.materialKey, {
  //       pdtQuantity: mat.pdtQuantity - matQuanNeeded,
  //     });
  //   } else {
  //     console.log("not enogugh present");
  //   }
  // });

  const order = await Order.create({
    customerName,
    productDetails,
    productQuantity,
    materialCost,
    orderStartDate: new Date(),
  });

  const fullOrder = await Order.findById(order._id)
    .populate("productDetails")
    .populate("productDetails.productMaterialList.materialKey");

  if (fullOrder) {
    res.status(201).json(fullOrder);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to add a product in the list
// @route   PUT /api/order/checkInventaryStatus/:id
// @access  protected
const checkInventarStatus = asynchHandler(async (req, res) => {
  const orderId = req.params.id;
  //   let matLis = JSON.parse(materialList);

  if (!orderId) {
    res.status(400);
    throw new Error("No OrderId Present");
  }

  const order = await Order.findById(orderId);

  const product = await Product.findById(order.productDetails);

  const inventaryStatus = await checkInvetary(
    product.productMaterialList,
    order
  );

  const fullOrder = await Order.findByIdAndUpdate(
    order._id,
    {
      inventarStatus: inventaryStatus,
    },
    { new: true }
  ).populate("productDetails");

  if (fullOrder) {
    res.status(200).json(fullOrder);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});
const checkInvetary = async (productMaterialList, order) => {
  const inventaryStatusPromises = productMaterialList.map(async (pMat) => {
    const mat = await Material.findById(pMat.materialKey);
    let matQuanNeeded = order.productQuantity * pMat.quantity;
    if (matQuanNeeded > mat.pdtQuantity) {
      return `Available quantity of ${mat.pdtName} is ${
        mat.pdtQuantity
      } but needed quantity is ${matQuanNeeded}, ${
        matQuanNeeded - mat.pdtQuantity
      } more needed`;
    }
    return null;
  });

  const inventaryStatus = await Promise.all(inventaryStatusPromises);
  return inventaryStatus.filter((status) => status !== null);
};

// @description   to add a product in the list
// @route   PUT /api/order/checkInventaryStatus/:id
// @access  protected
const allotMaterial = asynchHandler(async (req, res) => {
  const orderId = req.params.id;
  //   let matLis = JSON.parse(materialList);

  if (!orderId) {
    res.status(400);
    throw new Error("No OrderId Present");
  }

  const order = await Order.findById(orderId);

  if (order.inventarStatus.length !== 0) {
    res
      .status(208)
      .json({
        message: "InSufficent Inventary Present , Please update Inventary",
      });
    return;
  }

  if (order.materialAlloted) {
    res.status(210).json({ message: "Material Already Alloted" });
    return;
  }

  const product = await Product.findById(order.productDetails);

  await allotMateriall(product, order);

  const fullOrder = await Order.findByIdAndUpdate(orderId, {
    materialAlloted: true,
  }).populate("productDetails");

  if (fullOrder) {
    res.status(200).json(fullOrder);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

const allotMateriall = async function (product, order) {
  product.productMaterialList.forEach(async (pMat) => {
    const mat = await Material.findById(pMat.materialKey);
    let matQuanNeeded = order.productQuantity * pMat.quantity;
    if (matQuanNeeded <= mat.pdtQuantity) {
      await Material.findByIdAndUpdate(pMat.materialKey, {
        pdtQuantity: mat.pdtQuantity - matQuanNeeded,
      });
    } else {
      throw err("Insufficent Stock");
    }
  });
};

// @description   to add extra material which is needed
// first it checks the availablity of items and then allot the for the project and also marks the cost of the extra material needed
// @route   PUT /api/order/addExtraMaterials/:id
// @access  protected

const addExtraMaterials = asynchHandler(async (req, res) => {
  const orderId = req.params.id;
  const { extraMaterialsNeeded } = req.body;
  //   let matLis = JSON.parse(materialList);

  if (!orderId) {
    res.status(400);
    throw new Error("No OrderId Present");
  }

  if (!extraMaterialsNeeded) {
    res.status(400);
    throw new Error("No Extra Material Present");
  }

  const order = await Order.findById(orderId);

  let extraMaterialNeededd = [];

  extraMaterialsNeeded.forEach((material) => {
    let oneMatObj = {
      materialKey: Object.keys(material)[0],
      quantity: Object.values(material)[0],
    };
    extraMaterialNeededd.push(oneMatObj);
  });

  let extraMaterialCost = await allotExtraInventary(extraMaterialNeededd);

  const fullOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      extraMaterialNeeded:extraMaterialNeededd,
      extraMaterialCost,
    },
    { new: true }
  )
    .populate("productDetails")
    .populate("extraMaterialNeeded.materialKey");
  if (fullOrder) {
    res.status(200).json(fullOrder);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

const allotExtraInventary = async (productMaterialList) => {
  let extraMatCost = 0;

  const promises = productMaterialList.map(async (pMat) => {
    const mat = await Material.findById(pMat.materialKey);
    if (pMat.quantity <= mat.pdtQuantity) {
      extraMatCost += mat.pdtCost * pMat.quantity; // Accumulate the cost
      await Material.findByIdAndUpdate(pMat.materialKey, {
        pdtQuantity: mat.pdtQuantity - pMat.quantity,
      });
    } else {
      throw new Error("Insufficient Stock");
    }
  });

  // Wait for all promises to resolve
  await Promise.all(promises);

  return extraMatCost;
};

// @description   to add extra cost which is needed
// first it checks the availablity of items and then allot the for the project and also marks the cost of the extra material needed
// @route   PUT /api/order/addExtraCost/:id
// @access  protected

const markCompleteStatus = asynchHandler(async (req, res) => {
  const orderId = req.params.id;

  if (!orderId) {
    res.status(400);
    throw new Error("No OrderId Present");
  }

  const fullOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      status: "completed",
    },
    { new: true }
  ).populate("productDetails");

  if (fullOrder) {
    res.status(200).json(fullOrder);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to add extra cost which is needed
// first it checks the availablity of items and then allot the for the project and also marks the cost of the extra material needed
// @route   PUT /api/order/addExtraCost/:id
// @access  protected

const calculateOrderCost = asynchHandler(async (req, res) => {
  const orderId = req.params.id;
  const { otherCost } = req.body;
  //   let matLis = JSON.parse(materialList);

  if (!orderId) {
    res.status(400);
    throw new Error("No OrderId Present");
  }

  const order = await Order.findById(orderId);

  if (order.status != "completed") {
    res.status(400);
    res.send({ message: "Order Not Completed Yet" });
  }

  let overAllOrderCost =
    order.extraMaterialCost + order.materialCost + otherCost;

  const fullOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      otherCost,
      overAllOrderCost,
    },
    { new: true }
  ).populate("productDetails");

  if (fullOrder) {
    res.status(200).json(fullOrder);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to add extra cost which is needed
// first it checks the availablity of items and then allot the for the project and also marks the cost of the extra material needed
// @route   PUT /api/order/addExtraCost/:id
// @access  protected

const deleteOrder = asynchHandler(async (req, res) => {
  const orderId = req.params.id;

  if (!orderId) {
    res.status(400);
    throw new Error("No OrderId Present");
  }

  const order = await Order.findById(orderId);

  if (order.status == "completed") {
    res.status(400).json({
      message: "Order ALready Completed, No deletion can be perfomed",
    });
  }

  const fullOrder = await Order.findByIdAndDelete(orderId);

  if (fullOrder) {
    res.status(200).json({ message: "Order Deleted Succesfully!" });
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to get all the orders details
// first it checks the availablity of items and then allot the for the project and also marks the cost of the extra material needed
// @route   PUT /api/order/addExtraCost/:id
// @access  protected

const getOrders = asynchHandler(async (req, res) => {
  const allOrders = await Order.find({}).populate("productDetails");

  if (allOrders) {
    res.status(200).json(allOrders);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});


const getOrderDetailsById = asynchHandler(async (req, res) => {
  const orderId = req.params.id;
  const fullOrder = await Order.findById(orderId).populate("productDetails").populate("extraMaterialNeeded.materialKey");;

  if (fullOrder) {
    res.status(200).json(fullOrder);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

module.exports = {
  addOrder,
  checkInventarStatus,
  allotMaterial,
  addExtraMaterials,
  calculateOrderCost,
  markCompleteStatus,
  deleteOrder,
  getOrders,
  getOrderDetailsById
};
