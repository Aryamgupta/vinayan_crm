const asynchHandler = require("express-async-handler");
const Product = require("../Models/productModel");
const Material = require("../Models/materialMode");

// @description   to add a product in the list
// @route   POST /api/finalProduct/addProduct
// @access  Unprotected
const addProduct = asynchHandler(async (req, res) => {
  const { productName, productDes, materialList } = req.body;
  //   let matLis = JSON.parse(materialList);

  if (!productName || !productDes) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  //   check if user already exists
  const productExist = await Product.findOne({ productName });
  if (productExist) {
    res.status(400);
    throw new Error("Product already exists,please update the details");
  }
  let finalMaterialList = [];

  materialList.forEach((material) => {
    let oneMatObj = {
      materialKey: Object.keys(material)[0],
      quantity: Object.values(material)[0],
    };
    finalMaterialList.push(oneMatObj);
  });

  const approxMaterialCost = await finalMaterialList.reduce(
    async (totalPromise, value) => {
      const total = await totalPromise;
      const oneMat = await Material.findById(value.materialKey);
      return total + oneMat.pdtCost * value.quantity;
    },
    Promise.resolve(0)
  );

  console.log(approxMaterialCost);
  const product = await Product.create({
    productName,
    productDes,
    productMaterialList: finalMaterialList,
    approximateMaterialCost: approxMaterialCost,
  });

  const fullProduct = await Product.findById(product._id).populate(
    "productMaterialList.materialKey"
  );

  if (fullProduct) {
    res.status(201).json(fullProduct);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to edit a product in the list
// @route   PUT /api/finalProduct/editProduct
// @access  protected
const editProduct = asynchHandler(async (req, res) => {
  const { productName, productDes, materialList } = req.body;
  //   let matLis = JSON.parse(materialList);

  if (!productName) {
    res.status(400);
    throw new Error("No product present");
  }

  //   check if user already exists

  let finalMaterialList = [];

  materialList.forEach((material) => {
    let oneMatObj = {
      materialKey: Object.keys(material)[0],
      quantity: Object.values(material)[0],
    };
    finalMaterialList.push(oneMatObj);
  });

  const approxMaterialCost = await finalMaterialList.reduce(
    async (totalPromise, value) => {
      const total = await totalPromise;
      const oneMat = await Material.findById(value.materialKey);
      return total + oneMat.pdtCost * value.quantity;
    },
    Promise.resolve(0)
  );

  const product = await Product.findOne({ productName });

  const fullProduct = await Product.findOneAndUpdate(
    { productName },
    {
      productDes,
      productMaterialList: finalMaterialList,
      approximateMaterialCost: approxMaterialCost,
    },
    { new: true }
  ).populate("productMaterialList.materialKey");

  if (fullProduct) {
    res.status(200).json(fullProduct);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to edit a product in the list
// @route   DELETE /api/finalProduct/deleteProduct/:id
// @access  protected

const deleteProduct = asynchHandler(async (req, res) => {
  const productId = req.params.id;
  //   let matLis = JSON.parse(materialList);

  if (!productId) {
    res.status(400);
    throw new Error("No product present");
  }

  const product = await Product.findByIdAndDelete(productId);

  if (product) {
    res.status(200).json({ message: "Product deleted successfully" });
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to edit a product in the list
// @route   Put /api/finalProduct/recalculateCost/:id
// @access  protected

const recalculateCost = asynchHandler(async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    res.status(400);
    throw new Error("No product present");
  }

  const product = await Product.findById(productId);

  const approxMaterialCost = await product.productMaterialList.reduce(
    async (totalPromise, value) => {
      const total = await totalPromise;
      const oneMat = await Material.findById(value.materialKey);
      return total + oneMat.pdtCost * value.quantity;
    },
    Promise.resolve(0)
  );

  const fullProduct = await Product.findByIdAndUpdate(
    productId,
    {
      approximateMaterialCost: approxMaterialCost,
    },
    { new: true }
  ).populate("productMaterialList.materialKey");

  if (product) {
    res.status(200).json(fullProduct);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

const getAllProducts = asynchHandler(async (req, res) => {
  //   let matLis = JSON.parse(materialList);

  const allProducts = await Product.find({});

  if (allProducts) {
    res.status(200).json(allProducts);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

const getSingleProduct = asynchHandler(async (req, res) => {
  const productId = req.params.id;

  const productDetails = await Product.findById(productId).populate("productMaterialList.materialKey");

  if (productDetails) {
    res.status(200).json(productDetails);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
  recalculateCost,
  getAllProducts,
  getSingleProduct,
};
