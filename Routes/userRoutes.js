const express = require("express");
const {
  registerUser,
  authUser
} = require("../Controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);

module.exports = router;