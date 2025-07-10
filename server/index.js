const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const gigRoutes = require("./routes/gigRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/gigs", gigRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", require("./routes/auth"));
const youtubeRoutes = require("./routes/youtube");
app.use("/api/youtube", youtubeRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("Server started on port 5000"));
  })
  .catch(err => console.log(err));