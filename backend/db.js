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
    required: [true, "please tell us your username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please tell us your password"],
    minlength: 8,
  },
});


const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "please tell us your user id"],
  },
  balance: {
    type: Number,
    required: [true, "please tell us your balance"],
  },
});

const Account = mongoose.model("Accounts", accountSchema);
const User = mongoose.model("Users", userSchema);

module.exports = { User, Account };
