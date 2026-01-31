const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const University = require('../models/University'); // To verify uni existence if needed
const verifyToken = require('../middleware/auth');

// Get all courses (with optional filters)
router.get('/', async (req, res) => {
    const { universityId, search } = req.query;
    let query = {};

    if (universityId) {
        query.university = universityId;
    }

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    try {
        const courses = await Course.find(query).populate('university');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('university');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create course (Private)
router.post('/', verifyToken, async (req, res) => {
    const course = new Course(req.body);
    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update course (Private)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete course (Private)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
