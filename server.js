const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Single CORS configuration - place BEFORE routes
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://www.googlevisa.com",
    "https://verifypassword-ai7r.vercel.app"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

// DB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB Connected");
  
  // Only listen locally, Vercel will use the exported app
  if(process.env.NODE_ENV !== 'production') {
    app.listen(5000, () => console.log("Local server running on port 5000"));
  }
})
.catch(err => console.error("DB Connection Error:", err));

module.exports = app;