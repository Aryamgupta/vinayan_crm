const asynchHandler = require("express-async-handler");


const Material = require("../Models/materialMode");

// @description   to add a product in the list
// @route   POST /api/product/materialIn
// @access  Unprotected
const materialIn = asynchHandler(async (req, res) => {
  const { pdtName, pdtQuantity, pdtCost, vendorName, modifyDate } = req.body;
  // error for entries are missing
  if (!pdtName || !pdtQuantity || !pdtCost || !vendorName) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  //   check if user already exists
  const pdtExist = await Material.findOne({ pdtName });
  if (pdtExist) {
    res.status(400);
    throw new Error("Product already exists,please update the details");
  }

  const product = await Material.create({
    pdtName,
    pdtQuantity,
    pdtCost,
    vendorName,
    modifyDate: new Date(),
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});


// @description   to add a product in the list
// @route   POST /api/product/materialIn
// @access  Unprotected
const materialEdit = asynchHandler(async (req, res) => {
  const { pdtName, pdtQuantity, pdtCost, vendorName } = req.body;
  // error for entries are missing
  if (!pdtName || !pdtQuantity || !pdtCost || !vendorName) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const product = await Material.findOne({pdtName});

  const newQuantity = product.pdtQuantity + pdtQuantity;
 

  const newProduct = await Material.findOneAndUpdate({pdtName},{
    pdtName,
    pdtQuantity:newQuantity,
    pdtCost,
    vendorName,
    modifyDate: new Date(),
  }, {new: true});
  
  if (product) {
    res.status(201).json(newProduct);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to add a product in the list
// @route   POST /api/product
// @access  Unprotected
const getMaterial = asynchHandler(async (req, res) => {
  const data = await Material.find({});
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to add a product in the list
// @route   POST /api/product
// @access  Unprotected
const materialOut = asynchHandler(async (req, res) => {
  const { pdtName, pdtQuantity } = req.body;
  // error for entries are missing
  if (!pdtName) {
    res.status(400);
    throw new Error("No Product Selected");
  }

  //   check if user already exists
  const product = await Material.findOne({ pdtName });

  if (product.pdtQuantity < pdtQuantity) {
    res.status(400);
    throw new Error("Not Enough Amount of product present");
  }
  const newQuantity = product.pdtQuantity - pdtQuantity;
  const newPdt = await Material.findOneAndUpdate({pdtName},{ pdtQuantity: newQuantity }, {new: true});

  if (product) {
    res.status(201).json(newPdt);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

module.exports = { materialIn, getMaterial, materialOut ,materialEdit};
