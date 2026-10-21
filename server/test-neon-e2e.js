const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
if (!process.env.DATABASE_URL) {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const PORT = 5001; // Use 5001 for automated test to avoid conflict
process.env.PORT = PORT;

const { app, startServer } = require('./index');

function request(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                let parsed = data;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {}
                resolve({ status: res.statusCode, data: parsed });
            });
        });

        req.on('error', reject);
        if (body) {
            req.write(typeof body === 'string' ? body : JSON.stringify(body));
        }
        req.end();
    });
}

async function runE2ETest() {
    console.log('--- Starting GlobalPathwayHub Neon E2E Verification ---');
    const server = await startServer();

    try {
        // 1. Health check
        console.log('\n[1/7] Testing GET /api/health...');
        const health = await request('GET', '/api/health');
        console.log('Status:', health.status);
        console.log('Response:', JSON.stringify(health.data, null, 2));
        if (health.status !== 200 || !health.data.database.includes('Connected')) {
            throw new Error('Health check failed: ' + JSON.stringify(health.data));
        }

        // 2. Fetch Universities from Neon
        console.log('\n[2/7] Testing GET /api/universities (Neon Postgres read)...');
        const unis = await request('GET', '/api/universities');
        console.log(`Status: ${unis.status}, Universities found: ${unis.data.length}`);
        console.log('Sample university from Neon:', unis.data[0]?.name, `(${unis.data[0]?.country})`);
        if (unis.status !== 200 || unis.data.length === 0) {
            throw new Error('Failed to fetch universities from Neon');
        }

        // 3. Fetch Courses from Neon (with JOIN)
        console.log('\n[3/7] Testing GET /api/courses (Neon Postgres join & filter)...');
        const courses = await request('GET', '/api/courses?search=Computer');
        console.log(`Status: ${courses.status}, Matching courses found: ${courses.data.length}`);
        if (courses.data.length > 0) {
            console.log('Course:', courses.data[0].name);
            console.log('Joined University:', courses.data[0].university?.name || courses.data[0].university);
        }
        if (courses.status !== 200) {
            throw new Error('Failed to fetch courses from Neon');
        }

        // 4. Create University in Neon (Admin Write)
        console.log('\n[4/7] Testing POST /api/universities (Neon Postgres insert)...');
        const mockAuth = { 'Authorization': 'Bearer siam-secret-token' };
        const testUniName = 'Neon Test University ' + Date.now();
        const createUniRes = await request('POST', '/api/universities', {
            name: testUniName,
            country: 'Singapore',
            location: 'Singapore Campus',
            website: 'https://neon-test.edu',
            description: 'A test university running on Neon Serverless Postgres'
        }, mockAuth);
        console.log(`Status: ${createUniRes.status}, Created Uni ID: ${createUniRes.data._id}`);
        const testUniId = createUniRes.data._id;
        if (createUniRes.status !== 201 || !testUniId) {
            throw new Error('Failed to create university: ' + JSON.stringify(createUniRes.data));
        }

        // 5. Create Course in Neon (Foreign Key relationship)
        console.log('\n[5/7] Testing POST /api/courses (Neon Postgres foreign key insert)...');
        const createCourseRes = await request('POST', '/api/courses', {
            name: 'Neon Cloud Database Engineering',
            universityId: testUniId,
            level: 'Masters',
            duration: '2 years',
            tuitionFee: '$10,000/year',
            description: 'Advanced master course on serverless Postgres architecture.'
        }, mockAuth);
        console.log(`Status: ${createCourseRes.status}, Created Course ID: ${createCourseRes.data._id}`);
        console.log('Course university populated:', createCourseRes.data.university?.name);
        const testCourseId = createCourseRes.data._id;
        if (createCourseRes.status !== 201 || !testCourseId) {
            throw new Error('Failed to create course');
        }

        // 6. Submit Application to Neon
        console.log('\n[6/7] Testing POST /api/applications (Neon Postgres application insert)...');
        const appRes = await request('POST', '/api/applications', {
            fullName: 'Jane Doe',
            email: 'jane@example.com',
            phone: '+1234567890',
            country: 'Singapore',
            universityId: testUniId,
            courseId: testCourseId,
            notes: 'Testing application storage in Neon Postgres'
        });
        console.log(`Status: ${appRes.status}, Application ID: ${appRes.data.data?._id}`);
        if (appRes.status !== 201 || !appRes.data.success) {
            throw new Error('Failed to submit application: ' + JSON.stringify(appRes.data));
        }

        const getApps = await request('GET', '/api/applications');
        console.log(`Total applications retrieved from Neon: ${getApps.data.length}`);

        // 7. Cleanup test records
        console.log('\n[7/7] Testing DELETE course & university (Neon Postgres delete)...');
        const delCourse = await request('DELETE', `/api/courses/${testCourseId}`, null, mockAuth);
        console.log(`Course delete status: ${delCourse.status}`);
        const delUni = await request('DELETE', `/api/universities/${testUniId}`, null, mockAuth);
        console.log(`University delete status: ${delUni.status}`);

        console.log('\n=== ALL NEON POSTGRES END-TO-END TESTS PASSED SUCCESSFULLY! ===\n');
    } finally {
        server.close();
        const { pool } = require('./db');
        await pool.end();
    }
}

runE2ETest().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
