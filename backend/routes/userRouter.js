const express = require("express");
const { User, Account } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const signupSchema = zod.object({
  firstname: zod.string(),
  lastname: zod.string(),
  username: zod.string().email(),
  password: zod.string(),
});
const updateBody = zod.object({
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
  password: zod.string().optional(),
});

// This creates an instance of the express router which is used to define routes
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    const { success } = signupSchema.safeParse(body);
    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input Pass the correct data with the correct fields",
      });
    }
    const existingUser = await User.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "Username or Email already exists",
      });
    }

    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    const userId = newUser._id;

    await Account.create({
      userId: userId,
      balance: 1 + Math.random() * 1000,
    });
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      token,
      user: { newUser },
      message: "User created successfully",
    });
  } catch (error) {
    console.log("Error during signup process", error);
    res.status(500).json({
      message: "Error during signup process",
      error: error.message,
    });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      success: false,
      message: "Error while updating information",
    });
  }
  try {
    const userId = req.userId;
    const filteredBody = filterObj(
      req.body,
      "password",
      "firstname",
      "lastname"
    );
    const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (err) {
    console.log("Error updating information", err);
    res.status(500).json({
      success: false,
      message: "Error while updating information",
    });
  }
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  try {
    const users = await User.find({
      $or: [
        { firstname: { $regex: filter, $options: "i" } },
        { lastname: { $regex: filter, $options: "i" } },
      ],
    });
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No users found matching the filter: ${filter}`,
      });
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
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving users.",
    });
  }
});
module.exports = router;
