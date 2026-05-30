const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const app = express();

// ── Middleware ──
app.use(cors({
  origin: "http://localhost:5173", // your Vite frontend
  credentials: true,
}));
app.use(express.json());

// ── Routes ──
app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/recommend",     require("./routes/recommendRoutes"));

// ── Health check ──
app.get("/", (req, res) => {
  res.json({ message: "EduReach backend is running 🚀" });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

// ── Start server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});