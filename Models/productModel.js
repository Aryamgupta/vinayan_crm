const mongoose = require("mongoose");
const Material = require("./materialMode");

const matrialList = mongoose.Schema(
  {
    materialKey: { type: mongoose.Schema.Types.ObjectId, ref: "Material" }, // Referencing Product schema
    quantity: { type: Number },
  },{ _id: false }
);

const productSchema = mongoose.Schema({
  productName: { type: "String", unique: true, required: true },
  productDes: { type: "String", required: true },
  productMaterialList:[matrialList],
  approximateMaterialCost: { type: "Number" },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
