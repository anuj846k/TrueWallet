const AppError = require("../utils/appError");
const { User } = require("../Model/userModel");
const { Account } = require("../Model/accountModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const zod = require("zod");
const { Transaction } = require("../Model/transactionModel");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const signupSchema = zod.object({
  firstname: zod.string(),
  lastname: zod.string(),
  username: zod.string().email(),
  password: zod.string(),
});
const loginSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
const updateBody = zod.object({
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
  password: zod.string().optional(),
});

//Helper function to filter allowed fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.signup = catchAsync(async (req, res, next) => {
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    return next(
      new AppError(
        "Invalid input Pass the correct data with the correct fields",
        400
      )
    );
  }
  const existingUser = await User.findOne({
    username: req.body.username,
  });
  if (existingUser) {
    return next(new AppError("Username or Email already exists", 400));
  }

  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });

  // creating Account
  const id = newUser._id;
  const account = await Account.create({
    userId: id,
    balance: 1000,
  });

  // Generating token
  const token = signToken(id);

  newUser.password = undefined;

  // send Response
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: { newUser },
      account: {
        balance: account.balance,
      },
    },
    message: "User created successfully",
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return next(new AppError("Invalid input data", 400));
  }

  //Check if user Id exists or not

  if (!req.userId) {
    return next(new AppError("Please log in to update your profile", 401));
  }

  const filteredBody = filterObj(req.body, "password", "firstname", "lastname");
  const updatedUser = await User.findByIdAndUpdate(req.userId, filteredBody, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  updatedUser.password = undefined;

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
    message: "User updated successfully",
  });
});

exports.bulk = catchAsync(async (req, res, next) => {
  const filter = req.query.filter?.trim() || "";

  const users = await User.find({
    $or: [
      { firstname: { $regex: filter, $options: "i" } },
      { lastname: { $regex: filter, $options: "i" } },
    ],
  });
  if (users.length === 0) {
    return next(
      new AppError(`No users found matching the filter: ${filter}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    users: users.map((user) => ({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      _id: user._id,
    })),
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { success } = loginSchema.safeParse(req.body);
  if (!success) {
    return next(new AppError("Pls provide username/email and password", 400));
  }
  const user = await User.findOne({ username: req.body.username }).select(
    "+password"
  );

  if (
    !user ||
    !(await user.correctPassword(req.body.password, user.password))
  ) {
    return next(new AppError("Incorrect username/email or password", 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    user:{firstname:user.firstname,lastname:user.lastname,username:user.username}
  });
});

exports.balance = catchAsync(async (req, res, next) => {
  const account = await Account.findOne({ userId: req.userId }).populate(
    "userId"
  );
  if (!account) {
    return next(new AppError("Account not found", 404));
  }
  res.status(200).json({
    balance: account.balance,
    user: account.userId,
  });
});

exports.transfer = catchAsync(async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );
    if (!account || account.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Insufficient balance", 400));
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Reciever's Account not found", 404));
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
    await Transaction.create(
      [
        {
          fromId: account._id,
          toId: toAccount._id,
          amount,
          status: "completed",
        },
      ],
      { session: session }
    );
    session.endSession();
    res.status(200).json({
      message: "Transfer successful",
      success: true,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error transferring funds:", error);
    next(new AppError("Error transferring funds", 500));
  }
});

exports.recent = catchAsync(async (req, res, next) => {
  try {
    const userId = req.userId;
    const account = await Account.findOne({ userId: userId });
    if (!account) {
      return next(new AppError("Account not found", 404));
    }

    const recentTransactions = await Transaction.find({
      $or: [{ fromId: account._id }, { toId: account._id }],
    })
      .limit(10)
      .populate({
        path: "fromId",
        populate: {
          path: "userId",
          model: "Users",
          select: "firstname lastname",
        },
      })
      .populate({
        path: "toId",
        populate: {
          path: "userId",
          model: "Users",
          select: "firstname lastname",
        },
      })
      .sort({ createdAt: -1 });

    const formattedTransactions = recentTransactions.map((transaction) => {
      const isCredit =
        transaction.toId._id.toString() === account._id.toString();

      return {
        id: transaction._id,
        title: isCredit
          ? `Received from ${transaction.fromId.userId.firstname} ${transaction.fromId.userId.lastname}`
          : `Sent to ${transaction.toId.userId.firstname} ${transaction.toId.userId.lastname}`,
        amount: transaction.amount,
        type: isCredit ? "credit" : "debit",
        date: new Date(transaction.createdAt).toLocaleDateString(),
        createdAt: transaction.createdAt,
      };
    });

    res.status(200).json({
      transactions: formattedTransactions,
    });
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent transactions",
    });
  }
});

exports.profile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    message: "success",
    data: user,
  });
});
