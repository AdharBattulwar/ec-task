
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const userRoute = require("./routes/v1/User");
const connectionRoute = require("./routes/v1/Connection");

require("./db/connection");
mongoose.connect("mongodb://localhost:27017/ectask1");

const port = process.env.PORT;

// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function serveStatic() {
  app.use(express.static(path.join(__dirname, "./frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./frontend/dist"));
  });
}

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/connection",connectionRoute)

const server = app.listen(port, () => {
  console.log(`Listening to port ${port}`);
  serveStatic();
});

// unhandled rejection problem
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err}`);
  console.log("Shutting down the server due to unhandled rejection");
  server.close(() => {
    process.exit(1);
  });
});
