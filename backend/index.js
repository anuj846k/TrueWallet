const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const userRouter = require("./routes/userRouter");
const accountRouter = require("./routes/accountRouter");
const cors = require("cors");

DB = process.env.MONGO_URI;

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);


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
