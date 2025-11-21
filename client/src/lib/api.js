import { malaysianUniversities, getPublicUniversities, getPrivateUniversities, searchUniversities, filterUniversitiesByType } from '@/data/universitiesData';

// Simulate async behavior for consistency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCountries = async () => {
    await delay(100);
    return [{ id: 1, name: 'Malaysia', code: 'MY' }];
};

export const fetchUniversities = async (typeFilter) => {
    await delay(100);
    if (typeFilter === 'public') {
        return getPublicUniversities();
    } else if (typeFilter === 'private') {
        return getPrivateUniversities();
    }
    return malaysianUniversities;
};

export const fetchCourses = async (universityId, search) => {
    await delay(100);

    let results = [...malaysianUniversities];

    // Filter by university if specified
    if (universityId) {
        results = results.filter(uni => uni.id === parseInt(universityId));
    }

    // Search if query provided
    if (search) {
        results = searchUniversities(search);
    }

    return results;
};

export const loginUser = async (email, password) => {
    await delay(300);
    // Mock authentication
    if (email === 'admin@eadventure.com' && password === 'admin') {
        return { success: true, user: { id: 1, name: 'Admin User', email, role: 'admin' } };
    }
    if (email === 'student@test.com' && password === 'student') {
        return { success: true, user: { id: 2, name: 'Student User', email, role: 'student' } };
    }
    return { success: false, message: 'Invalid credentials' };
};

export const registerUser = async (name, email, password) => {
    await delay(300);
    // Mock registration
    return {
        success: true,
        user: { id: Date.now(), name, email, role: 'student' }
    };
};

// Admin functions (mock)
export const addCountry = async (data) => {
    await delay(200);
    return { success: true, data };
};

export const addUniversity = async (data) => {
    await delay(200);
    return { success: true, data };
};

export const addCourse = async (data) => {
    await delay(200);
    return { success: true, data };
};
