const asynchHandler = require("express-async-handler");

const bcrypt = require("bcryptjs");
const User = require("../Models/user");
const generateToken = require("../config/genrateToken");

// @description   to sign up a user
// @route   POST /api/user
// @access  Unprotected
const registerUser = asynchHandler(async (req, res) => {
  const { name, email, password ,phNumber,role} = req.body;
  // error for entries are missing
  if (!name || !email || !password || !phNumber || !role) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  //   check if user already exists
  let userExist = await User.findOne({ email });
  userExist = await User.findOne({phNumber});
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

 
  let userName = name.substring(0, 1) + phNumber.substring(0, 5);
  const user = await User.create({
    userName,
    email,
    name,
    password,
    phNumber,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userName:user.userName,
      phNumber:user.phNumber,
      role:user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @description   to login in
// @route   POST /api/user/login
// @access  Unprotected
const authUser = asynchHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userName:user.userName,
      phNumber:user.phNumber,
      role:user.role,
      token: generateToken(user._id),
    });
    // res.status(201).json(user);
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});


// to create bycrpt string
const createPass = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = { registerUser, authUser };
