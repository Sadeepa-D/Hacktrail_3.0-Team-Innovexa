const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const skillRoutes = require("./routes/skill.routes");
const opportunityRoutes = require("./routes/opportunity.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Secure Middleware
app.use(helmet());

// Enable CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin '${origin}' not allowed`));
    },
    credentials: false, // JWT is in Authorization header, not cookies — no credentials needed
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

// Register API Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", userRoutes);         // Alias for backward compatibility
app.use("/api/skills", skillRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/admin", adminRoutes);

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running smoothly" });
});

module.exports = app;
