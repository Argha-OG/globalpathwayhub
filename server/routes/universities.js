const express = require('express');
const router = express.Router();
const University = require('../models/University');
const verifyToken = require('../middleware/auth');

// Get all universities
router.get('/', async (req, res) => {
    try {
        const universities = await University.find();
        res.json(universities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one university
router.get('/:id', async (req, res) => {
    try {
        const university = await University.findById(req.params.id);
        if (!university) return res.status(404).json({ message: 'University not found' });
        res.json(university);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create university (Private)
router.post('/', verifyToken, async (req, res) => {
    const university = new University(req.body);
    try {
        const newUniversity = await university.save();
        res.status(201).json(newUniversity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update university (Private)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedUniversity = await University.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUniversity) return res.status(404).json({ message: 'University not found' });
        res.json(updatedUniversity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete university (Private)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const university = await University.findByIdAndDelete(req.params.id);
        if (!university) return res.status(404).json({ message: 'University not found' });
        res.json({ message: 'University deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
