
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    text: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },

    completed: {
        type: Boolean,
        default: false
    }

});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;