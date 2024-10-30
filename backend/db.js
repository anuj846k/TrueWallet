const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "please tell us your first name"],
    trim: true,
    maxlength: 20,
  },
  lastname: {
    type: String,
    required: [true, "please tell us your last name"],
    trim: true,
    maxlength: 20,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please tell us your password"],
    minlength: 8,
  },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
