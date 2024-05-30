const mongoose = require("mongoose");
const InternalAllotment = require("./internalAllotmentModel");


const employeeSchema = mongoose.Schema({
  empId: { type: "String", required: "true", unique: "true" },
  name: { type: "String", required: true },
  phoneNumber: { type: "String", required: true },
  email: { type: "String", required: true },
  pic: { type: "String", required: true },
  jobRole: { type: "String", required: true },
  dept: {
    type: "String",
    required: true,
    enum: {
      values: ["Hardware", "Software", "Marketing", "Other"],
      message: "{Value} is not supported",
    },
  },
  allotMentRecord: [
    {
      type: Schema.Types.ObjectId,
      ref: "InternalAllotment",
    },
  ],
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
