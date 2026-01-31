const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }
    return { 'Content-Type': 'application/json' };
};

// Public Data Fetching
export const fetchCountries = async () => {
    return [{ id: 1, name: 'Malaysia', code: 'MY' }, { id: 2, name: 'USA', code: 'US' }, { id: 3, name: 'UK', code: 'GB' }];
};

export const fetchUniversities = async (typeFilter) => {
    try {
        const response = await fetch(`${API_URL}/universities`);
        if (!response.ok) throw new Error('Failed to fetch universities');
        const data = await response.json();
        if (typeFilter) {
            return data;
        }
        return data;
    } catch (error) {
        console.error("Error fetching universities:", error);
        return [];
    }
};

export const fetchCourses = async (universityId, search) => {
    const params = new URLSearchParams();
    if (universityId) params.append('universityId', universityId);
    if (search) params.append('search', search);

    try {
        const response = await fetch(`${API_URL}/courses?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        return await response.json();
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

export const loginUser = async (email, password) => {
    if (email === "Siam#18767:)" && password === "Siam#18767:)") {
        localStorage.setItem('admin_token', 'siam-secret-token');
        localStorage.setItem('admin_user', JSON.stringify({ email }));
        return {
            success: true,
            user: { email, role: 'admin' }
        };
    }
    return { success: false, message: "Invalid credentials" };
};

export const logoutUser = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
};

export const registerUser = async (name, email, password) => {
    // Mock registration
    return { success: true, user: { name, email, role: 'user' } };
};

// Admin CRUD
export const addUniversity = async (data) => {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/universities`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        if (!response.ok) throw new Error(resData.message || 'Failed to add university');
        return { success: true, data: resData };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const addCourse = async (data) => {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        if (!response.ok) throw new Error(resData.message || 'Failed to add course');
        return { success: true, data: resData };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
