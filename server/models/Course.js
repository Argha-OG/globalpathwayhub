const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true
    },
    level: {
        type: String,
        enum: ['Bachelors', 'Masters', 'PhD', 'Diploma', 'Certificate'],
        required: true
    },
    duration: {
        type: String, // e.g., "4 years"
        required: true
    },
    tuitionFee: {
        type: String
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);
