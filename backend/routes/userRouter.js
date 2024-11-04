const express = require("express");
const { User, Account } = require("../db");
const zod = require("zod");
const authMiddleware = require("../middleware");
const authController = require("../controller/authController.");

// This creates an instance of the express router which is used to define routes
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login); 

router.put("/update", authMiddleware, authController.update);

router.get("/bulk", authController.bulk);
module.exports = router;
