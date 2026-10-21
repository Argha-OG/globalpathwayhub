const express = require('express');
const router = express.Router();
const { query, formatApplication } = require('../db');

// Create new application (Public)
router.post('/', async (req, res) => {
    try {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 6);
        const { fullName, email, phone, country, universityId, courseId, ...rest } = req.body;

        const insertSql = `
            INSERT INTO applications (id, full_name, email, phone, country, university_id, course_id, status, data, submitted_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            RETURNING *
        `;

        const result = await query(insertSql, [
            id,
            fullName || null,
            email || null,
            phone || null,
            country || null,
            universityId || null,
            courseId || null,
            'pending',
            JSON.stringify(req.body)
        ]);

        const newApplication = formatApplication(result.rows[0]);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: newApplication
        });
    } catch (err) {
        console.error('Error submitting application to Neon:', err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// Get all applications (Private - Admin only)
router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM applications ORDER BY submitted_at DESC');
        const formatted = result.rows.map(formatApplication);
        res.json(formatted);
    } catch (err) {
        console.error('Error fetching applications from Neon:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
