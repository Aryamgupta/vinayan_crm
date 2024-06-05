const asynchHandler = require("express-async-handler");
const Material = require("../Models/materialMode");
const Employee = require("../Models/employeeModel");
const InternalAllotment = require("../Models/internalAllotmentModel");

// @description   to add new employee
// @route   POST /api/emplyoee/add
// @access  protect
const addEmplyee = asynchHandler(async (req, res) => {
  const { name, phoneNumber, email, pic, jobRole, dept } = req.body;

  if (!name || !phoneNumber || !email || !pic || !jobRole || !dept) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  let roleContainer = {
    Hardware: "HD",
    Software: "SD",
    Marketing: "MD",
    Other: "OW",
  };

  let empId =
    name.split(" ")[0].toUpperCase() +
    phoneNumber.substring(0, 5) +
    roleContainer[dept];

  //   check if user already exists
  const empExist = await Employee.findOne({ empId });
  if (empExist) {
    res.status(400);
    throw new Error("Employee already exists,please update the details");
  }

  const employee = await Employee.create({
    empId,
    name,
    phoneNumber,
    email,
    pic,
    jobRole,
    dept,
  });

  if (employee) {
    res.status(201).json(employee);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to get employee details
// @route   GET /api/emplyoee/:empId
// @access  protect
const getAllEmplyee = asynchHandler(async (req, res) => {
  let employees = await Employee.find({});

  if (employees) {
    res.status(200).json(employees);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to get employee details
// @route   GET /api/emplyoee/:empId
// @access  protect
const getEmplyee = asynchHandler(async (req, res) => {
  let empId = req.params.empId;

  if (!empId) {
    res.status(400);
    throw new Error("No Employee Id is provided");
  }

  let employee = await Employee.findOne({ empId })
    .populate("allotMentRecord")
    .populate({
      path: "allotMentRecord",
      populate: {
        path: "materialId",
      },
    });

  if (employee) {
    res.status(200).json(employee);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to allocate materials to the employee
// @route   PUT /api/emplyoee/allotMaterial/:empId
// @access  protect
const allocateMaterial = asynchHandler(async (req, res) => {
  let empId = req.params.empId;

  if (!empId) {
    res.status(400);
    throw new Error("No Employee Id is provided");
  }

  let employee = await Employee.findOne({ empId });

  let { materialId, materialQuantity, allotmentDate } = req.body;

  const allotStatus = await verifyAvailablity(materialId, materialQuantity);

  if (!allotStatus) {
    res.status(300).json({ message: "Not enough material into the inventary" });
    return;
  }

  let internalAllotment = await InternalAllotment.create({
    allotedTo: employee._id,
    materialId,
    materialQuantity,
    allotmentDate: new Date(),
  });

  employee = await Employee.findOneAndUpdate(
    { empId },
    {
      $push: { allotMentRecord: internalAllotment._id },
    },
    {
      new: true,
    }
  )
    .populate("allotMentRecord")
    .populate({
      path: "allotMentRecord",
      populate: {
        path: "materialId",
      },
    });

  if (employee) {
    res.status(200).json(employee);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

const verifyAvailablity = async function (materialId, materialQuantity) {
  let matDetails = await Material.findById(materialId);

  if (matDetails.pdtQuantity >= materialQuantity) {
    await Material.findByIdAndUpdate(materialId, {
      pdtQuantity: matDetails.pdtQuantity - materialQuantity,
    });
    return true;
  }
  return false;
};

// @description   to allocate materials to the employee
// @route   PUT /api/emplyoee/allotMaterial/:empId
// @access  protect
const deAllocateMaterial = asynchHandler(async (req, res) => {
  let  {allotId}  = req.body;
  let empId = req.params.empId;

  // if (!allotId || !empId) {
  //   res.status(400);
  //   throw new Error("No Id is provided");
  // }

  let internalAllot = await InternalAllotment.findById(allotId);

  if(internalAllot.returnToStore){
    res.status(400);
    throw new Error("Already deallocated");
  }

  let deAllocateStatus = await dealloacateMat(
    internalAllot.materialId,
    internalAllot.materialQuantity
  );

  if (!deAllocateStatus) {
    res.status(400);
    throw new Error("Something went wrong");
  }

  internalAllot = await InternalAllotment.findByIdAndUpdate(
    allotId,
    { returnToStore: true, deAllotmentDate: new Date() },
    { new: true }
  )
    .populate("allotedTo")
    .populate("materialId");

  if (empId) {
    let employee = await Employee.findById(empId)
      .populate("allotMentRecord")
      .populate({
        path: "allotMentRecord",
        populate: {
          path: "materialId",
        },
      });
    if (employee) {
      res.status(200).json(employee);
      return;
    } else {
      res.status(400);
      throw new Error("Something went wrong");
    }
  } else {
    if (internalAllot) {
      res.status(200).json(internalAllot);
      return;
    } else {
      res.status(400);
      throw new Error("Something went wrong");
    }
  }
});

const dealloacateMat = async function (materialId, materialQuantity) {
  await Material.findByIdAndUpdate(materialId, {
    $inc: { pdtQuantity: materialQuantity },
  });
  return true;
};

module.exports = {
  addEmplyee,
  getEmplyee,
  getAllEmplyee,
  allocateMaterial,
  deAllocateMaterial,
};
