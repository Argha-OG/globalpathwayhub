const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { query, formatUniversity } = require('../db');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all universities (with optional country filter)
router.get('/', async (req, res) => {
    try {
        const { country, search } = req.query;
        let sql = 'SELECT * FROM universities';
        const params = [];
        const conditions = [];

        if (country) {
            params.push(country);
            conditions.push(`country = $${params.length}`);
        }

        if (search) {
            params.push(`%${search}%`);
            conditions.push(`name ILIKE $${params.length}`);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY name ASC';

        const result = await query(sql, params);
        const formatted = result.rows.map(formatUniversity);
        res.json(formatted);
    } catch (err) {
        console.error('Error fetching universities from Neon:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get one university
router.get('/:id', async (req, res) => {
    try {
        const result = await query('SELECT * FROM universities WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'University not found' });
        }
        res.json(formatUniversity(result.rows[0]));
    } catch (err) {
        console.error('Error fetching university by id from Neon:', err);
        res.status(500).json({ message: err.message });
    }
});

// Create university (Private)
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const universityData = req.body;
        let logo = universityData.logo || null;

        if (req.file) {
            logo = `/uploads/${req.file.filename}`;
        }

        const id = Date.now().toString() + Math.random().toString(36).substr(2, 6);
        const name = universityData.name;
        const country = universityData.country;
        const location = universityData.location;
        const website = universityData.website || null;
        const description = universityData.description || null;

        const insertSql = `
            INSERT INTO universities (id, name, country, location, website, description, logo, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            RETURNING *
        `;

        const result = await query(insertSql, [id, name, country, location, website, description, logo]);
        res.status(201).json(formatUniversity(result.rows[0]));
    } catch (err) {
        console.error('Error creating university in Neon:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update university (Private)
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const checkRes = await query('SELECT * FROM universities WHERE id = $1', [req.params.id]);
        if (checkRes.rows.length === 0) {
            return res.status(404).json({ message: 'University not found' });
        }

        const existing = checkRes.rows[0];
        const updatedName = req.body.name !== undefined ? req.body.name : existing.name;
        const updatedCountry = req.body.country !== undefined ? req.body.country : existing.country;
        const updatedLocation = req.body.location !== undefined ? req.body.location : existing.location;
        const updatedWebsite = req.body.website !== undefined ? req.body.website : existing.website;
        const updatedDescription = req.body.description !== undefined ? req.body.description : existing.description;
        let updatedLogo = existing.logo;

        if (req.file) {
            updatedLogo = `/uploads/${req.file.filename}`;
        } else if (req.body.logo !== undefined) {
            updatedLogo = req.body.logo;
        }

        const updateSql = `
            UPDATE universities
            SET name = $1, country = $2, location = $3, website = $4, description = $5, logo = $6
            WHERE id = $7
            RETURNING *
        `;

        const result = await query(updateSql, [
            updatedName,
            updatedCountry,
            updatedLocation,
            updatedWebsite,
            updatedDescription,
            updatedLogo,
            req.params.id
        ]);

        res.json(formatUniversity(result.rows[0]));
    } catch (err) {
        console.error('Error updating university in Neon:', err);
        res.status(400).json({ message: err.message });
    }
});

// Delete university (Private)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await query('DELETE FROM universities WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'University not found' });
        }
        res.json({ message: 'University deleted' });
    } catch (err) {
        console.error('Error deleting university in Neon:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
