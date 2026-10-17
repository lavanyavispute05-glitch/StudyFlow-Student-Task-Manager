const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Task = require("./models/Task");

const app = express();

const PORT = 5050;


// Middleware

app.use(cors());
app.use(express.json());


// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully! 🗄️");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:");
        console.log(error.message);
    });


// Test route

app.get("/", (req, res) => {

    res.send("StudyFlow Backend is running! 🚀");

});


// Signup API

app.post("/api/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Account already exists with this email."
            });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password
        });

        // Save user to MongoDB
        await newUser.save();

        res.json({
            message: "Account created successfully! 🎉"
        });

    } catch (error) {

        console.log("Signup error:", error.message);

        res.status(500).json({
            message: "Something went wrong."
        });

    }

});

// Login API

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Account not found."
            });
        }

        // Check password
        if (user.password !== password) {
            return res.status(400).json({
                message: "Incorrect password."
            });
        }

        // Login successful
        res.json({
            message: "Login successful! 🎉",
            user: {
    _id: user._id,
    name: user.name,
    email: user.email
    }
        });

    } catch (error) {

        console.log("Login error:", error.message);

        res.status(500).json({
            message: "Something went wrong."
        });

    }

});

// Start server

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});

// Create Task API

app.post("/api/tasks", async (req, res) => {

    try {

        const { userId, text, date, priority } = req.body;

        if (!userId || !text || !date) {
            return res.status(400).json({
                message: "Please provide all required task details."
            });
        }

        const newTask = new Task({
            userId,
            text,
            date,
            priority: priority || "Low",
            completed: false
        });

        await newTask.save();

        res.json({
            message: "Task added successfully! ✅",
            task: newTask
        });

    } catch (error) {

        console.log("Create task error:", error.message);

        res.status(500).json({
            message: "Something went wrong."
        });

    }

});

// Get Tasks API

app.get("/api/tasks/:userId", async (req, res) => {

    try {

        const { userId } = req.params;

        const tasks = await Task.find({ userId }).sort({ date: 1 });

        res.json(tasks);

    } catch (error) {

        console.log("Get tasks error:", error.message);

        res.status(500).json({
            message: "Something went wrong."
        });

    }

});

// Complete / Uncomplete Task API

// Update Task API
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { text, date, priority, completed } = req.body;

        const updateData = {};

        if (text !== undefined) {
            updateData.text = text;
        }

        if (date !== undefined) {
            updateData.date = date;
        }

        if (priority !== undefined) {
            updateData.priority = priority;
        }

        if (completed !== undefined) {
            updateData.completed = completed;
        }

        const task = await Task.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            message: "Task updated successfully! ✅",
            task: task
        });

    } catch (error) {
        console.log("Update task error:", error.message);

        res.status(500).json({
            message: "Something went wrong."
        });
    }
});
// Delete Task API

app.delete("/api/tasks/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            message: "Task deleted successfully! 🗑️"
        });

    } catch (error) {

        console.log("Delete task error:", error.message);

        res.status(500).json({
            message: "Something went wrong."
        });

    }

});