const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: function () {
            return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.name}`;
        }
    },
    preferences: {
        theme: { type: String, default: 'dark' },
        currency: { type: String, default: 'INR' }
    },
    savedDestinations: [{ type: String }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
