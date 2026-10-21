const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { query, formatCourse } = require('../db');

// SQL fragment to select courses joined with their university
const COURSE_JOIN_SELECT = `
    SELECT c.*,
           u.name as u_name,
           u.country as u_country,
           u.location as u_location,
           u.website as u_website,
           u.description as u_description,
           u.logo as u_logo,
           u.created_at as u_created_at
    FROM courses c
    LEFT JOIN universities u ON c.university_id = u.id
`;

// Get all courses (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { universityId, search } = req.query;
        let sql = COURSE_JOIN_SELECT;
        const params = [];
        const conditions = [];

        if (universityId) {
            params.push(universityId);
            conditions.push(`c.university_id = $${params.length}`);
        }

        if (search) {
            params.push(`%${search}%`);
            conditions.push(`c.name ILIKE $${params.length}`);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY c.created_at DESC';

        const result = await query(sql, params);
        const formatted = result.rows.map(row => formatCourse(row));
        res.json(formatted);
    } catch (err) {
        console.error('Error fetching courses from Neon:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get one course
router.get('/:id', async (req, res) => {
    try {
        const sql = `${COURSE_JOIN_SELECT} WHERE c.id = $1`;
        const result = await query(sql, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(formatCourse(result.rows[0]));
    } catch (err) {
        console.error('Error fetching course by id from Neon:', err);
        res.status(500).json({ message: err.message });
    }
});

// Create course (Private)
router.post('/', verifyToken, async (req, res) => {
    try {
        const uniId = req.body.universityId || req.body.university;
        if (!uniId) {
            return res.status(400).json({ message: 'universityId is required' });
        }

        const id = Date.now().toString() + Math.random().toString(36).substr(2, 6);
        const name = req.body.name;
        const level = req.body.level || 'Bachelors';
        const duration = req.body.duration || '3 years';
        const tuitionFee = req.body.tuitionFee || null;
        const description = req.body.description || null;

        const insertSql = `
            INSERT INTO courses (id, name, university_id, level, duration, tuition_fee, description, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            RETURNING *
        `;

        await query(insertSql, [id, name, uniId, level, duration, tuitionFee, description]);

        // Return populated course
        const fetchSql = `${COURSE_JOIN_SELECT} WHERE c.id = $1`;
        const fetchRes = await query(fetchSql, [id]);

        res.status(201).json(formatCourse(fetchRes.rows[0]));
    } catch (err) {
        console.error('Error creating course in Neon:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update course (Private)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const checkRes = await query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
        if (checkRes.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const existing = checkRes.rows[0];
        const updatedName = req.body.name !== undefined ? req.body.name : existing.name;
        const updatedUniId = req.body.universityId || req.body.university || existing.university_id;
        const updatedLevel = req.body.level !== undefined ? req.body.level : existing.level;
        const updatedDuration = req.body.duration !== undefined ? req.body.duration : existing.duration;
        const updatedTuitionFee = req.body.tuitionFee !== undefined ? req.body.tuitionFee : existing.tuition_fee;
        const updatedDescription = req.body.description !== undefined ? req.body.description : existing.description;

        const updateSql = `
            UPDATE courses
            SET name = $1, university_id = $2, level = $3, duration = $4, tuition_fee = $5, description = $6
            WHERE id = $7
            RETURNING *
        `;

        await query(updateSql, [
            updatedName,
            updatedUniId,
            updatedLevel,
            updatedDuration,
            updatedTuitionFee,
            updatedDescription,
            req.params.id
        ]);

        const fetchSql = `${COURSE_JOIN_SELECT} WHERE c.id = $1`;
        const fetchRes = await query(fetchSql, [req.params.id]);

        res.json(formatCourse(fetchRes.rows[0]));
    } catch (err) {
        console.error('Error updating course in Neon:', err);
        res.status(400).json({ message: err.message });
    }
});

// Delete course (Private)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await query('DELETE FROM courses WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course deleted' });
    } catch (err) {
        console.error('Error deleting course in Neon:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
