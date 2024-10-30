const express = require("express");
const User = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");

const signupSchema = zod.object({
  firstname: zod.string().email(),
  lastname: zod.string(),
  username: zod.string(),
  password: zod.string(),
});

// This creates an instance of the express router which is used to define routes
const router = express.Router();

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid input/ Username or Email aleardy exists",
    });
  }
  const existingUser = User.findOne({
    username: req.body.username,
  });
  if (existingUser) {
    return res.status(400).json({
      message: "Invalid input/ Username or Email aleardy exists",
    });
  }

  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
  const userId = newUser._id;   
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(201).json({
    token,
    user: { newUser },
    message: "User created successfully",
  });
});

module.exports = router;
