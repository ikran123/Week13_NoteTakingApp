import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createDatabase } from "./db.js";
import notesRoutes from "./routes/notes.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// CORS configuration

 const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://your-production-domain.com"]
      : [
          "http://localhost:3000",
          "http://localhost:5173",
          "http://localhost:5176",
        ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};


// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Initialize database
createDatabase()
  .then(() => {
    console.log("Database initialized successfully");
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

// Routes
app.use("/api/notes", notesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    error: `Cannot ${req.method} ${req.url}`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle specific error types
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      error: err.message,
    });
  }

  if (err.name === "DatabaseError") {
    return res.status(500).json({
      message: "Database Error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    message: "An unexpected error occurred",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server");
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
