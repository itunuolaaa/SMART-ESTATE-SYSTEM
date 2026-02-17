const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const complaintRoutes = require("./routes/complaintRoutes");
const visitorRoutes = require("./routes/visitorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Default route for backend health check
app.get("/", (req, res) => {
    res.json({ message: "Smart Estate Backend is running successfully!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/options/complaints", complaintRoutes); // Using a slightly different path to avoid collision if any
app.use("/api/visitors", visitorRoutes);
app.use("/api/chatbot", chatbotRoutes);

module.exports = app;