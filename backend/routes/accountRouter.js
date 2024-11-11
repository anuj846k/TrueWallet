const express = require("express");
const rateLimit = require("express-rate-limit");
const authMiddleware = require("../middleware");
const authController = require("../controller/authController");

const router = express.Router();

const transferLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: "error",
    message: "Too many transfer attempts. Please try again after 15 minutes.",
  },
});

router.post(
  "/transfer",
  authMiddleware,
  transferLimiter,
  authController.transfer
);
router.get("/balance", authMiddleware, authController.balance);
router.get("/recent", authMiddleware, authController.recent);

module.exports = router;
