const express = require("express");
const authMiddleware = require("../middleware");
const { Account } = require("../db");
const mongoose = require("mongoose");
const zod = require("zod");

const router = express.Router();

// Define the transfer schema
const transferSchema = zod.object({
  amount: zod
    .number()
    .positive("Amount must be positive")
    .transform((val) => Number(val)),
  to: zod.string().min(1, "Recipient ID is required"),
});

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId }).populate(
      "userId"
    );
    if (!account) {
      return res.status(404).json({
        message: "Account not found",
        success: false,
      });
    }
    res.status(200).json({
      balance: account.balance,
      user: account.userId,
    });
  } catch (err) {
    console.log("Error while fetching balance", err);
    res.status(500).json({
      message: "Error while fetching balance",
      success: false,
      error: err,
    });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { success } = transferSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        message: "Amount or Recipient ID is invalid",
        success: false,
      });
    }

    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );
    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
        success: false,
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "Account not found",
        success: false,
      });
    }

    // Perform the transfer
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      message: "Transfer successful",
      success: true,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error while transferring balance", err);
    res.status(500).json({
      message: "Error while transferring balance",
      success: false,
      error: err,
    });
  }
});

module.exports = router;
