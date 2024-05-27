const mongoose = require("mongoose")

const materialSchema = mongoose.Schema(
  {

    pdtName:{ type: "String",unique:true, required: true },
    pdtQuantity:{ type: "Number", required: true},
    pdtCost: { type: "Number", required: true },
    vendorName: { type: "String", required: true },
    modifyDate: { type: "Date", required: true},
  }
);


const Material = mongoose.model("Material", materialSchema);

module.exports = Material;