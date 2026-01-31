const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const universityRoutes = require('./routes/universities');
const courseRoutes = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

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
