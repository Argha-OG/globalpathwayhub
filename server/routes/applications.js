const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/fileStorage');

const FILE_NAME = 'applications.json';

// Create new application (Public)
router.post('/', (req, res) => {
    try {
        const applications = readData(FILE_NAME);
        const newApplication = {
            _id: Date.now().toString(),
            ...req.body,
            submittedAt: new Date().toISOString(),
            status: 'pending' // pending, approved, rejected
        };

        applications.push(newApplication);
        writeData(FILE_NAME, applications);

        res.status(201).json({ success: true, message: 'Application submitted successfully', data: newApplication });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Get all applications (Private - Admin only)
// You can add verifyToken middleware here later
router.get('/', (req, res) => {
    try {
        const applications = readData(FILE_NAME);
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
