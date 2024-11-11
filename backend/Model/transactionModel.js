const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  fromId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accounts",
    required: [true, "please tell us your from id"],
  },
  toId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accounts",
    required: [true, "please tell us your to id"],
  },
  amount: {
    type: Number,
    required: [true, "please tell us your amount"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
});
transactionSchema.index({ fromId: 1, createdAt: -1 });
transactionSchema.index({ toId: 1, createdAt: -1 });
const Transaction = mongoose.model("Transactions", transactionSchema);

module.exports = { Transaction };
