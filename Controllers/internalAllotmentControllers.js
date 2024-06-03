const asynchHandler = require("express-async-handler");
const Material = require("../Models/materialMode");
const Employee = require("../Models/employeeModel");
const InternalAllotment = require("../Models/internalAllotmentModel");

// @description   to get all allotments
// @route   GET /api/internalAllotement
// @access  protect
const getAllAlotments = asynchHandler(async (req, res) => {
  const allotMents = await InternalAllotment.find({}).populate("allotedTo").populate("materialId");
  if (allotMents) {
    res.status(200).json(allotMents);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});


// @description   to get allot By Id
// @route   GET /api/internalAllotement/:allotId
// @access  protect
const getAllotById = asynchHandler(async (req, res) => {

    let allotId = req.params.allotId;

    const allotMent = await InternalAllotment.findById(allotId).populate("allotedTo").populate("materialId");

    if (allotMent) {
      res.status(200).json(allotMent);
    } else {
      res.status(400);
      throw new Error("Something went wrong");
    }
  });



module.exports = {
    getAllAlotments,
    getAllotById
};
