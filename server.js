require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const dns = require("dns")
const app = express();
const authRoutes = require("./routes/authRoutes");
const projectRoutes= require("./routes/projectRoutes");
const taskRoutes= require("./routes/taskRoutes");
const dashboardRoutes= require("./routes/dashboardRoutes");
const commentRoutes = require("./routes/commentRoutes");


dns.setServers(["1.1.1.1", "8.8.8.1"]);
// Middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch(err => {
    console.log("MongoDB Error:", err);
});

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Test Route
app.get("/test", (req, res) => {
    res.send("TrackJet Server is Running 🚀");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/comments", commentRoutes);
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});