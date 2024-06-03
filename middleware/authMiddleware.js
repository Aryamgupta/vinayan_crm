const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../Models/user");

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const authAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.roleType == "admin") {
    try {
      next();
    } catch (error) {
      res.status(402);
      throw new Error("Not authorized, as admin");
    }
  }
});

module.exports = { protect };