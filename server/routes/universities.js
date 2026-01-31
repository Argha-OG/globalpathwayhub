const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { readData, writeData } = require('../utils/fileStorage');

const FILE_NAME = 'universities.json';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all universities
router.get('/', (req, res) => {
    try {
        const universities = readData(FILE_NAME);
        res.json(universities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one university
router.get('/:id', (req, res) => {
    try {
        const universities = readData(FILE_NAME);
        const university = universities.find(u => u._id === req.params.id);
        if (!university) return res.status(404).json({ message: 'University not found' });
        res.json(university);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create university (Private)
router.post('/', verifyToken, upload.single('image'), (req, res) => {
    try {
        const universities = readData(FILE_NAME);
        const universityData = req.body;

        if (req.file) {
            universityData.logo = `/uploads/${req.file.filename}`;
        }

        const newUniversity = {
            _id: Date.now().toString(),
            ...universityData,
            createdAt: new Date().toISOString()
        };

        universities.push(newUniversity);
        writeData(FILE_NAME, universities);

        res.status(201).json(newUniversity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update university (Private)
router.put('/:id', verifyToken, (req, res) => {
    try {
        const universities = readData(FILE_NAME);
        const index = universities.findIndex(u => u._id === req.params.id);

        if (index === -1) return res.status(404).json({ message: 'University not found' });

        const updatedUniversity = { ...universities[index], ...req.body };
        universities[index] = updatedUniversity;
        writeData(FILE_NAME, universities);

        res.json(updatedUniversity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete university (Private)
router.delete('/:id', verifyToken, (req, res) => {
    try {
        let universities = readData(FILE_NAME);
        const initialLength = universities.length;
        universities = universities.filter(u => u._id !== req.params.id);

        if (universities.length === initialLength) return res.status(404).json({ message: 'University not found' });

        writeData(FILE_NAME, universities);
        res.json({ message: 'University deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
