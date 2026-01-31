const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const uniFile = path.join(dataDir, 'universities.json');
const courseFile = path.join(dataDir, 'courses.json');

const malaysiaUnis = [
    "Taylor's University", "Sunway University", "Monash University Malaysia", "University of Nottingham Malaysia",
    "Asia Pacific University (APU)", "UCSI University", "Management and Science University (MSU)",
    "Universiti Teknologi Petronas (UTP)", "Universiti Tenaga Nasional (UNITEN)", "Multimedia University (MMU)",
    "Universiti Tunku Abdul Rahman (UTAR)", "Tunku Abdul Rahman UMT", "HELP University",
    "INTI International University", "SEGi University", "Limkokwing University", "University of Cyberjaya",
    "Nilai University", "Manipal International University", "Quest International University",
    "Raffles University", "Berjaya University College", "UOW Malaysia KDU", "Heriot-Watt University Malaysia",
    "Xiamen University Malaysia", "Curtin University Malaysia", "Swinburne University Sarawak",
    "Newcastle University Medicine Malaysia", "University of Southampton Malaysia", "University of Reading Malaysia"
];

const usaUnis = [
    "Harvard University", "Stanford University", "MIT", "Caltech", "UC Berkeley",
    "Yale University", "Princeton University", "Columbia University", "University of Chicago", "UCLA"
];

const ukUnis = [
    "University of Oxford", "University of Cambridge", "Imperial College London", "UCL",
    "University of Edinburgh", "University of Manchester", "King's College London",
    "LSE", "University of Bristol", "University of Warwick"
];

const courseTemplates = [
    { name: "BSc Computer Science", level: "Bachelors", duration: "3 years", tuitionFee: "$15,000/year", description: "Comprehensive computer science program covering AI, software engineering, and data science." },
    { name: "Bachelor of Business Administration", level: "Bachelors", duration: "3 years", tuitionFee: "$12,000/year", description: "Develop specific business skills in management, finance, and marketing." },
    { name: "BEng Mechanical Engineering", level: "Bachelors", duration: "4 years", tuitionFee: "$18,000/year", description: "In-depth study of mechanical systems, thermodynamics, and design." },
    { name: "MBBS Medicine", level: "Bachelors", duration: "5 years", tuitionFee: "$25,000/year", description: "Professional medical degree training future doctors." },
    { name: "Master of Business Administration (MBA)", level: "Masters", duration: "1-2 years", tuitionFee: "$20,000/total", description: "Advanced business leadership and management training." },
    { name: "MSc Data Science", level: "Masters", duration: "1 year", tuitionFee: "$16,000/total", description: "Specialized training in big data analytics and machine learning." },
    { name: "PhD in Engineering", level: "PhD", duration: "3-4 years", tuitionFee: "$10,000/year", description: "Research-focused degree pushing the boundaries of engineering knowledge." }
];

const universities = [];
const courses = [];

const generateData = (names, country) => {
    names.forEach((name, index) => {
        const uniId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const uni = {
            _id: uniId,
            name: name,
            country: country,
            location: `${country} Campus`,
            website: `https://www.${name.replace(/\s+/g, '').toLowerCase()}.edu`,
            description: `A top-tier institution in ${country} offering world-class education.`,
            logo: `https://placehold.co/600x400?text=${encodeURIComponent(name)}`,
            createdAt: new Date().toISOString()
        };
        universities.push(uni);

        // Add 3-5 random courses for each university
        const numCourses = Math.floor(Math.random() * 3) + 3;
        const shuffledCourses = courseTemplates.sort(() => 0.5 - Math.random()).slice(0, numCourses);

        shuffledCourses.forEach(t => {
            courses.push({
                _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                university: uniId,
                ...t,
                createdAt: new Date().toISOString()
            });
        });
    });
};

generateData(malaysiaUnis, "Malaysia");
generateData(usaUnis, "USA");
generateData(ukUnis, "UK");

// Ensure directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(uniFile, JSON.stringify(universities, null, 2));
fs.writeFileSync(courseFile, JSON.stringify(courses, null, 2));

console.log(`Successfully seeded ${universities.length} universities and ${courses.length} courses.`);
