const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const userRouter = require("./routes/userRouter");
const accountRouter = require("./routes/accountRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const cors = require("cors");

const DB = process.env.MONGO_URI;

const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

//Handle Undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error handler
app.use(globalErrorHandler);

//Database connection
mongoose
  .connect(DB, {})
  .then(() => {
    console.log("Db connected successfully");
  })
  .catch((err) => {
    console.log(`Error while connecting to database: ${err}`);
  });

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
