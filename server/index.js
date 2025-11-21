const express = require('express');
const cors = require('cors');
const { users, countries, universities, courses } = require('./store');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        role: 'student'
    };
    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword });
});

// Data Routes
app.get('/api/countries', (req, res) => {
    res.json(countries);
});

app.get('/api/universities', (req, res) => {
    const { countryId } = req.query;
    if (countryId) {
        const filtered = universities.filter(u => u.countryId === parseInt(countryId));
        return res.json(filtered);
    }
    res.json(universities);
});

app.get('/api/courses', (req, res) => {
    const { universityId, search } = req.query;
    let filtered = courses;

    if (universityId) {
        filtered = filtered.filter(c => c.universityId === parseInt(universityId));
    }

    if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(c => c.name.toLowerCase().includes(lowerSearch));
    }

    // Join with University and Country data for display
    const enrichedCourses = filtered.map(c => {
        const uni = universities.find(u => u.id === c.universityId);
        const country = countries.find(cnt => cnt.id === uni.countryId);
        return { ...c, university: uni, country };
    });

    res.json(enrichedCourses);
});

// Admin Routes (Simplified, no auth middleware for prototype)
app.post('/api/admin/countries', (req, res) => {
    const { name, code } = req.body;
    const newCountry = { id: countries.length + 1, name, code };
    countries.push(newCountry);
    res.json(newCountry);
});

app.post('/api/admin/universities', (req, res) => {
    const { name, countryId, location } = req.body;
    const newUni = { id: universities.length + 1, name, countryId: parseInt(countryId), location };
    universities.push(newUni);
    res.json(newUni);
});

app.post('/api/admin/courses', (req, res) => {
    const { name, universityId, level, duration } = req.body;
    const newCourse = { id: courses.length + 1, name, universityId: parseInt(universityId), level, duration };
    courses.push(newCourse);
    res.json(newCourse);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
