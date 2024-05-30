const mongoose = require("mongoose");
const Material = require("./materialMode");
const Employee = require("./employeeModel");

const internalAllotmentSchema = mongoose.Schema({
  allotedTo:{type: mongoose.Schema.Types.ObjectId, ref: "Employee",required :true },
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material",required :true },
  MaterialQuantity: { type: "Number", required: true },
  allotmentDate: { type: "Date", required: true },
  returnToStore: { type: "Boolean",default:"false"},
  deAllotmentDate: { type: "Date", required: true },
});

const InternalAllotment = mongoose.model("InternalAllotment", internalAllotmentSchema);

module.exports = InternalAllotment;
