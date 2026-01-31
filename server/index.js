const express = require('express');
const cors = require('cors');
require('dotenv').config();

const universityRoutes = require('./routes/universities');
const courseRoutes = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
// Database Connection (Removed for JSON storage)

// Routes
app.use('/api/universities', universityRoutes);
app.use('/api/courses', courseRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('GlobalPathwayHub API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
