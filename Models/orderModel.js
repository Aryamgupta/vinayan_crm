const mongoose = require("mongoose");
const Product = require("./productModel");
const Material = require("./materialMode");

const matrialList = mongoose.Schema(
  {
    materialKey: { type: mongoose.Schema.Types.ObjectId, ref: "Material" }, // Referencing Product schema
    quantity: { type: Number },
  },{ _id: false }
);


const orderSchema = mongoose.Schema({
  customerName: { type: "String" , required:true},
  productDetails:{ type: mongoose.Schema.Types.ObjectId, ref: "Product",required :true },
  productQuantity: { type: "Number",required:true},
  inventarStatus:[{type:"String"}],
  materialAlloted:{type:"Boolean",default:false},
  extraMaterialNeeded:[matrialList],
  materialCost:{type:"Number",default:0},
  extraMaterialCost: { type: "Number" ,default:0},
  otherCost: { type: "Number" ,default:0},
  overAllOrderCost: { type: "Number",default:0},
  status: { type: "String",default:"initated" },
  orderStartDate: { type: "Date",required:true},
  orderCompleteDate:{type: "Date"},
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
