const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    userName : { type: "String", required: true },
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    phNumber:{ type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    role:{ type: "String",  required: true },
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;