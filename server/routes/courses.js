const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { readData, writeData } = require('../utils/fileStorage');

const FILE_NAME = 'courses.json';
const UNI_FILE_NAME = 'universities.json';

// Helper to manually populate university
const populateUniversity = (course, universities) => {
    const university = universities.find(u => u._id === course.universityId || u._id === course.university);
    return { ...course, university: university || null };
};

// Get all courses (with optional filters)
router.get('/', (req, res) => {
    try {
        let courses = readData(FILE_NAME);
        const universities = readData(UNI_FILE_NAME);
        const { universityId, search } = req.query;

        if (universityId) {
            courses = courses.filter(c => c.universityId === universityId || c.university === universityId);
        }

        if (search) {
            const regex = new RegExp(search, 'i');
            courses = courses.filter(c => regex.test(c.name));
        }

        const populatedCourses = courses.map(course => populateUniversity(course, universities));
        res.json(populatedCourses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one course
router.get('/:id', (req, res) => {
    try {
        const courses = readData(FILE_NAME);
        const universities = readData(UNI_FILE_NAME);
        const course = courses.find(c => c._id === req.params.id);

        if (!course) return res.status(404).json({ message: 'Course not found' });

        const populatedCourse = populateUniversity(course, universities);
        res.json(populatedCourse);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create course (Private)
router.post('/', verifyToken, (req, res) => {
    try {
        const courses = readData(FILE_NAME);
        const newCourse = {
            _id: Date.now().toString(),
            ...req.body,
            // Ensure consistency in key naming if possible, but support both for now
            university: req.body.universityId,
            createdAt: new Date().toISOString()
        };

        courses.push(newCourse);
        writeData(FILE_NAME, courses);

        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update course (Private)
router.put('/:id', verifyToken, (req, res) => {
    try {
        const courses = readData(FILE_NAME);
        const index = courses.findIndex(c => c._id === req.params.id);

        if (index === -1) return res.status(404).json({ message: 'Course not found' });

        const updatedCourse = { ...courses[index], ...req.body };
        courses[index] = updatedCourse;
        writeData(FILE_NAME, courses);

        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete course (Private)
router.delete('/:id', verifyToken, (req, res) => {
    try {
        let courses = readData(FILE_NAME);
        const initialLength = courses.length;
        courses = courses.filter(c => c._id !== req.params.id);

        if (courses.length === initialLength) return res.status(404).json({ message: 'Course not found' });

        writeData(FILE_NAME, courses);
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
