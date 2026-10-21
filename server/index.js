const express = require('express');
const cors = require('cors');
const path = require('path');

// Ensure environment variables are loaded
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
if (!process.env.DATABASE_URL) {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const { initDatabase, pool } = require('./db');
const universityRoutes = require('./routes/universities');
const courseRoutes = require('./routes/courses');
const applicationRoutes = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/universities', universityRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/applications', applicationRoutes);

// Health Check with Neon Postgres status
app.get('/api/health', async (req, res) => {
    try {
        const dbRes = await pool.query('SELECT NOW() as db_time');
        res.json({
            status: 'ok',
            database: 'Neon Postgres (Connected)',
            timestamp: dbRes.rows[0].db_time
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            database: 'Neon Postgres (Error)',
            message: err.message
        });
    }
});

app.get('/', (req, res) => {
    res.send('GlobalPathwayHub API is running on Neon Postgres');
});

// Start Server after database schema verification
async function startServer() {
    try {
        await initDatabase();
        const server = app.listen(PORT, () => {
            console.log(`[SERVER] Server running on http://localhost:${PORT}`);
            console.log(`[NEON] Connected to Neon Postgres (${process.env.NEON_BRANCH || 'production'})`);
        });
        return server;
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
