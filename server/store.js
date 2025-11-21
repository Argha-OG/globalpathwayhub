// In-memory data store

const users = [
    { id: 1, name: 'Admin User', email: 'admin@eadventure.com', password: 'adminpassword', role: 'admin' },
    { id: 2, name: 'Student User', email: 'student@test.com', password: 'studentpassword', role: 'student' }
];

const countries = [
    { id: 1, name: 'USA', code: 'US' },
    { id: 2, name: 'UK', code: 'GB' },
    { id: 3, name: 'Canada', code: 'CA' },
    { id: 4, name: 'Australia', code: 'AU' },
    { id: 5, name: 'Germany', code: 'DE' }
];

const universities = [
    { id: 1, name: 'Harvard University', countryId: 1, location: 'Cambridge, MA' },
    { id: 2, name: 'Stanford University', countryId: 1, location: 'Stanford, CA' },
    { id: 3, name: 'University of Oxford', countryId: 2, location: 'Oxford, UK' },
    { id: 4, name: 'University of Toronto', countryId: 3, location: 'Toronto, Canada' },
    { id: 5, name: 'University of Melbourne', countryId: 4, location: 'Melbourne, Australia' },
    { id: 6, name: 'Technical University of Munich', countryId: 5, location: 'Munich, Germany' }
];

const courses = [
    { id: 1, name: 'Computer Science', universityId: 1, level: 'Bachelors', duration: '4 years' },
    { id: 2, name: 'MBA', universityId: 1, level: 'Masters', duration: '2 years' },
    { id: 3, name: 'Data Science', universityId: 2, level: 'Masters', duration: '2 years' },
    { id: 4, name: 'Law', universityId: 3, level: 'Bachelors', duration: '3 years' },
    { id: 5, name: 'Medicine', universityId: 4, level: 'Bachelors', duration: '5 years' },
    { id: 6, name: 'Engineering', universityId: 5, level: 'Bachelors', duration: '4 years' },
    { id: 7, name: 'Physics', universityId: 6, level: 'Masters', duration: '2 years' }
];

module.exports = {
    users,
    countries,
    universities,
    courses
};
