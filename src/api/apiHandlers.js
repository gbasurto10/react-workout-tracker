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
        throw new Error('gin failed');
    }

    return response.json();
}

export async function registerUser(email, password, userType, firstName, lastName) {
    console.log('Sending request with headers:', headers);
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ email, password, userType, firstName, lastName }),
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }

    return response.json();
}



// Fetch User Profile
export async function fetchUserProfile(clientId) {
    const response = await fetch(`${API_URL}/clients/${clientId}`, {
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


// Fetch Trainer Profiles
export async function fetchTrainers() {
    try {
        const response = await fetch(`${API_URL}/users/trainers`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch trainers');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching trainers:', error);
        throw error;
    }
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

// Fetch Details of a Specific Workout Session
export async function fetchSessionDetails(sessionId) {
    const response = await fetch(`${API_URL}/workout-session/${sessionId}`, {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Fetching workout session details failed');
    }

    return response.json();
}

// Fetch Session Exercises
export const fetchSessionExercises = async (sessionId) => {
    const response = await fetch(`${API_URL}/sessionExercises/${sessionId}`, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}


// Function to start a new workout session for a client
export async function startNewWorkoutSession(clientId) {
    const response = await fetch(`${API_URL}/start-workout-session`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ UserID: clientId }), // Corrected to UserID and removed Date and Description
    });

    if (!response.ok) {
        throw new Error('Starting new workout session failed');
    }

    return response.json();
}

export async function fetchExercises() {
    const response = await fetch(`${API_URL}/exercises`, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error('Fetching exercises failed');
    }

    return response.json();
}

export async function createNewExercise(exerciseData) {
    const response = await fetch(`${API_URL}/exercises`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(exerciseData)
    });

    if (!response.ok) {
        throw new Error('Creating new exercise failed');
    }

    return response.json();
}

// Save a workout session
export async function saveWorkoutSession(sessionId, exercises) {

    console.log("Preparing to send to server:", { sessionId, exercises });

    const response = await fetch(`${API_URL}/save-workout-session/${sessionId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ exercises }),
    });

    if (!response.ok) {
        throw new Error('Saving workout session failed');
    }

    return response.json();
}

// Mark a workout session as finished
export async function finishWorkoutSession(sessionId) {
    const response = await fetch(`${API_URL}/workout-session/${sessionId}/finish`, {
        method: 'PUT',
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Failed to mark workout session as finished');
    }

    return response.json();
}

// Delete a workout session
export async function deleteWorkoutSession(sessionId, clientId) {
    const response = await fetch(`${API_URL}/delete-workout-session/${sessionId}`, {
        method: 'DELETE',
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Failed to delete workout session');
    }

    await response.json();
    return clientId;
}

// Update a workout session
export async function updateWorkoutSession(sessionId) {
    const response = await fetch(`${API_URL}/update-workout-session/${sessionId}`, {
        method: 'PUT',
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Failed to update workout session');
    }

    return response.json();
}

// Fetch Exercise History for a Specific Exercise
export async function fetchExerciseHistory(userId, exerciseId) {
    try {
        const response = await fetch(`${API_URL}/client/${userId}/exercise-history/${exerciseId}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch exercise history');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching exercise history:', error);
        throw error;
    }
}

