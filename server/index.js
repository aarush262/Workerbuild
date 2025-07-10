const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const gigRoutes = require("./routes/gigRoutes");
const youtubeRoutes = require("./routes/youtube");
const authRoutes = require("./routes/auth");

const app = express();

// ✅ CORRECT: CORS config (before routes)
app.use(cors({
  origin: "https://workerbuild.vercel.app",  // ✅ replace with your actual frontend Vercel domain
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use("/api/gigs", gigRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("✅ Server started on port 5000"));
  })
  .catch(err => console.log("❌ MongoDB Error:", err));