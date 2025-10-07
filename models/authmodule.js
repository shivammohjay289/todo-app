const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,   // ✅ spelling correct
        required: true,
        trim: true,
        unique: true,   // 👍 email duplicate na ho iske liye (optional but recommended)
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Student", "Visitor"], // Capitalization thoda standard rakha
        default: "Visitor" // optional default
    }
});

module.exports = mongoose.model("User", userSchema);
