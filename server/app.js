require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Connect to MongoDB before serving requests.
connectDB();

app.use(express.json({ limit: "100kb" }));
app.use(
  cors({
    // Comma-separated list of allowed origins, e.g. "https://www.amcar.ge,https://amcar.ge"
    origin: (process.env.CORS_ORIGIN || "*").split(",").map((o) => o.trim()),
  })
);

// Serve uploaded mechanic photos referenced by relative /uploads/... paths.
// Drop the image files into server/uploads to have them served from here.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */
app.use("/api/contact", contactRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Fallback for unknown API routes.
app.use("/api", (_req, res) => res.status(404).json({ ok: false, error: "NOT_FOUND" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
