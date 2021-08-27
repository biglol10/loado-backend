const express = require("express");
const dotenv = require("dotenv");
// const logger = require('./middleware/logger')
const morgan = require("morgan");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
var path = require("path");

// middleware
const errorHandler = require("./middleware/error");

// LOAD env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const homeworks = require("./routes/homeworks");
const usersRoute = require("./routes/users");

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Dev logging middleware (like in logger)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // in console.log GET /api/v1/bootcamps?page=2&limit=2 200 648.149 ms - 3377
}

app.use("/loado/api/homeworks", homeworks);
app.use("/loado/api/users", usersRoute);

app.use(express.static(path.join(__dirname, "build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// this should be below controller to use
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
