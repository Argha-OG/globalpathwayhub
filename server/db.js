const { Pool, Client } = require('pg');
const path = require('path');
const fs = require('fs');

// Ensure dotenv is loaded
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
if (!process.env.DATABASE_URL) {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const connectionString = process.env.DATABASE_URL;
const unpooledConnectionString = process.env.DATABASE_URL_UNPOOLED || connectionString;

if (!connectionString) {
    console.error('[WARN] DATABASE_URL is not set in environment variables.');
}

// Connection pool for application queries (using pooled endpoint)
const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle Neon Postgres client', err);
});

async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    return res;
}

// Formatting helpers to maintain exact contract with frontend
function formatUniversity(row) {
    if (!row) return null;
    return {
        _id: row.id,
        name: row.name,
        country: row.country,
        location: row.location,
        website: row.website,
        description: row.description,
        logo: row.logo,
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
    };
}

function formatCourse(row, populatedUni = null) {
    if (!row) return null;
    let university = populatedUni;
    if (!university && row.u_name) {
        university = {
            _id: row.university_id,
            name: row.u_name,
            country: row.u_country,
            location: row.u_location,
            website: row.u_website,
            description: row.u_description,
            logo: row.u_logo,
            createdAt: row.u_created_at ? new Date(row.u_created_at).toISOString() : null
        };
    } else if (!university) {
        university = row.university_id;
    }

    return {
        _id: row.id,
        name: row.name,
        universityId: row.university_id,
        university: university,
        level: row.level,
        duration: row.duration,
        tuitionFee: row.tuition_fee,
        description: row.description,
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
    };
}

function formatApplication(row) {
    if (!row) return null;
    const extraData = row.data && typeof row.data === 'object' ? row.data : {};
    return {
        _id: row.id,
        ...extraData,
        fullName: row.full_name || extraData.fullName,
        email: row.email || extraData.email,
        phone: row.phone || extraData.phone,
        country: row.country || extraData.country,
        universityId: row.university_id || extraData.universityId,
        courseId: row.course_id || extraData.courseId,
        status: row.status || 'pending',
        submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : new Date().toISOString()
    };
}

// Initialize tables and seed initial data if empty
async function initDatabase() {
    // Neon Best Practice: Use direct (unpooled) connection for DDL / migrations
    const migrationClient = new Client({
        connectionString: unpooledConnectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await migrationClient.connect();
        console.log('[DB] Connected to Neon Postgres for schema verification...');

        await migrationClient.query(`
            CREATE TABLE IF NOT EXISTS universities (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                country TEXT NOT NULL,
                location TEXT NOT NULL,
                website TEXT,
                description TEXT,
                logo TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS courses (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                university_id TEXT NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
                level TEXT NOT NULL,
                duration TEXT NOT NULL,
                tuition_fee TEXT,
                description TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS applications (
                id TEXT PRIMARY KEY,
                full_name TEXT,
                email TEXT,
                phone TEXT,
                country TEXT,
                university_id TEXT,
                course_id TEXT,
                status TEXT DEFAULT 'pending',
                data JSONB DEFAULT '{}'::jsonb,
                submitted_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_courses_university_id ON courses(university_id);
            CREATE INDEX IF NOT EXISTS idx_courses_name ON courses(name);
            CREATE INDEX IF NOT EXISTS idx_universities_country ON universities(country);
        `);

        // Check if universities table is empty, and seed from JSON if available
        const countRes = await migrationClient.query('SELECT COUNT(*) FROM universities');
        const uniCount = parseInt(countRes.rows[0].count, 10);

        if (uniCount === 0) {
            const uniFilePath = path.join(__dirname, 'data', 'universities.json');
            const courseFilePath = path.join(__dirname, 'data', 'courses.json');

            if (fs.existsSync(uniFilePath)) {
                const unis = JSON.parse(fs.readFileSync(uniFilePath, 'utf-8'));
                console.log(`[SEED] Seeding ${unis.length} universities into Neon Postgres...`);
                for (const u of unis) {
                    await migrationClient.query(
                        `INSERT INTO universities (id, name, country, location, website, description, logo, created_at)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                         ON CONFLICT (id) DO NOTHING`,
                        [u._id, u.name, u.country, u.location, u.website, u.description, u.logo, u.createdAt || new Date()]
                    );
                }
            }

            if (fs.existsSync(courseFilePath)) {
                const courses = JSON.parse(fs.readFileSync(courseFilePath, 'utf-8'));
                console.log(`[SEED] Seeding ${courses.length} courses into Neon Postgres...`);
                for (const c of courses) {
                    const uniId = c.university || c.universityId;
                    await migrationClient.query(
                        `INSERT INTO courses (id, name, university_id, level, duration, tuition_fee, description, created_at)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                         ON CONFLICT (id) DO NOTHING`,
                        [c._id, c.name, uniId, c.level, c.duration, c.tuitionFee, c.description, c.createdAt || new Date()]
                    );
                }
            }
            console.log('[SUCCESS] Initial seed data imported into Neon Postgres successfully.');
        } else {
            console.log(`[DB] Neon Postgres schema verified. Database contains ${uniCount} universities.`);
        }
    } catch (err) {
        console.error('[ERROR] Error initializing Neon Postgres schema:', err);
        throw err;
    } finally {
        await migrationClient.end();
    }
}

module.exports = {
    pool,
    query,
    formatUniversity,
    formatCourse,
    formatApplication,
    initDatabase
};
