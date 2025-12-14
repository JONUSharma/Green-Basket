const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require('crypto'); // Built-in Node module

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // Prevents password hash from being retrieved by default
        minlength: 8,
        validate: {
            validator: function (value) {
                // Enforces one lowercase, one uppercase, one digit, one special char
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(value);
            },
            message: "Password requires: A-Z, a-z, 0-9, and one special character (@$!%*?&)."
        }
    },
    role: {
        type: String,
        enum: ["farmer", "retailer", "admin"],
        default: "retailer"
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        otpExpiry: Date
    },
    otpExpiry : {
        type: Date
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpire: {
        type: Date,
        select: false
    }
},
    {
        timestamps: true
    });

// --- Mongoose Middleware: Hash Password ---
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    // Hash the password with 12 salt rounds
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// --- Instance Method: Compare Password ---
userSchema.methods.correctPassword = async function (candidatePassword, userPasswordHash) {
    return await bcrypt.compare(candidatePassword, userPasswordHash);
};

const User = mongoose.model("User", userSchema);
module.exports = User;