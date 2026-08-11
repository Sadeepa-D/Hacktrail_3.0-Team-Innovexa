const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const app = express();

// Secure Middleware
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// Enable JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable Cookie Parsing
app.use(cookieParser());

// Enable Compression
app.use(compression());

// Enable Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Import Routes

//health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

//404 Route
app.use("/*", (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
