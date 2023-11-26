// apiHandlers.js

const IS_DEV = false;  // set this to true when developing at home, false otherwise

export const API_URL = IS_DEV ? 'http://192.168.1.162:3000' : 'http://api.codebyg.com:3000';
export const API_KEY = '01241991';

const headers = {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
};

//Login Function 
export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response.json();
}

// Register user 
export async function registerUser(email, password) {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }

    return response.json();
}


// Fetch User Profile
export async function fetchUserProfile(userId) {
    const response = await fetch(`${API_URL}/profiles/${userId}`, {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Fetching profile failed');
    }

    return response.json();
}


// Update profile
export async function updateUserProfile(userId, profileData) {
    const response = await fetch(`${API_URL}/updateProfile`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ id: userId, ...profileData }),
    });

    if (!response.ok) {
        throw new Error('Updating profile failed');
    }

    return response.json();
}


// Delete User profile
export async function deleteUserProfile(userId) {
    const response = await fetch(`${API_URL}/deleteProfile`, {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify({ id: userId }),
    });

    if (!response.ok) {
        throw new Error('Deleting profile failed');
    }

    return response.json();
}
