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
export async function registerUser(email, password, userType) {
    console.log('Sending request with headers:', headers); 
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ email, password, userType }),
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

// Fetch Clients' Profiles
export async function fetchClientsProfiles() {
    const response = await fetch(`${API_URL}/clients`, {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Fetching clients profiles failed');
    }

    return response.json();
}


// Create New Client Profile
export async function createClientProfile(clientData) {
    const response = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(clientData),
    });

    if (!response.ok) {
        throw new Error('Creating client profile failed');
    }

    return response.json();
}

// Fetch Workout Sessions for a Client
export async function fetchWorkoutSessions(clientId) {
    const response = await fetch(`${API_URL}/workout-sessions/${clientId}`, {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Fetching workout sessions failed');
    }

    return response.json();
}

// Create New Workout Session
export async function createWorkoutSession(sessionData) {
    const response = await fetch(`${API_URL}/workout-sessions`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
        throw new Error('Creating workout session failed');
    }

    return response.json();
}

// In your API handler file
export async function assignTrainerToClient(clientUserId, trainerUserId) {
    const response = await fetch(`${API_URL}/assign-trainer`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ clientUserId, trainerUserId }),
    });

    if (!response.ok) {
        throw new Error('Failed to assign trainer');
    }

    return response.json();
}
