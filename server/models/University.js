const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    description: {
        type: String
    },
    logo: {
        type: String // URL to logo
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('University', universitySchema);
