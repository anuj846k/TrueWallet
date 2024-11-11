const mongoose = require("mongoose");
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

module.exports = { Account };
