// apiHandlers.js

const IS_DEV = false;  // set this to true when developing at home, false otherwise

export const API_URL = IS_DEV ? 'http://192.168.1.162:3000' : 'https://api.codebyg.com:3000';
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
    console.log(`Making API call to URL: ${API_URL}/workout-sessions/${clientId}`);
    const response = await fetch(`${API_URL}/workout-sessions/${clientId}`, {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Fetching workout sessions failed');
    }

    return response.json();
}


// Fetch Details of an Active Workout Session
export async function fetchActiveSessionDetails(sessionId) {
    const url = `${API_URL}/workout-session-active/${sessionId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        if (!response.ok) {
            const errorData = await response.text(); // Using text() in case the response is not in JSON format
            console.error('[Client] Error fetching active workout session details:', errorData);
            throw new Error(errorData || 'Fetching active workout session details failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('[Client] Error in fetchActiveSessionDetails:', error);
        throw error;
    }
}

// Update Details of an ACtive Workout Session
export async function updateActiveSessionDetails(sessionId, description) {
    const url = `${API_URL}/update-workout-session-active/${sessionId}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ description }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('[Client] Error updating active workout session description:', errorData);
            throw new Error(errorData || 'Updating active workout session description failed');
        }

        return await response.json();
    } catch (error) {
        console.error('[Client] Error in updateActiveSessionDescription:', error);
        throw error;
    }
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

    const data = await response.json();

    return data;
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
    console.log("Fetched Session Exercises: ", response.json()); // Log the JSON response
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

// Fetch Exercises  
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

// Create New Exercise
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

// Update an Exercise
export async function updateExercise(exerciseId, exerciseData) {
    // Construct the URL with the exercise ID
    const url = `${API_URL}/update-exercise/${exerciseId}`;

    // Destructure and rename the fields from exerciseData to match the database structure
    const { Name, Type, Description, TracksTime, TracksDistance, TracksReps, TracksWeight } = exerciseData;

    // Convert boolean values to 1 or 0 for TracksTime, TracksDistance, TracksReps, and TracksWeight
    const requestBody = {
        Name,
        Type,
        Description, // Make sure this is a string or null
        TracksTime: TracksTime ? 1 : 0,
        TracksDistance: TracksDistance ? 1 : 0,
        TracksReps: TracksReps ? 1 : 0,
        TracksWeight: TracksWeight ? 1 : 0,
    };

    try {
        const response = await fetch(url, {
            method: 'PUT', // PUT method for updating
            headers: headers,
            body: JSON.stringify(requestBody), // Use requestBody with the correct structure
        });

        // Check if the request was successful
        if (!response.ok) {
            // Handle different types of errors (e.g., 400, 404, 500)
            const errorBody = await response.json(); // Assuming the server sends JSON error details
            throw new Error(errorBody.message || 'Failed to update exercise');
        }

        // Return the updated exercise data or success confirmation
        return response.json();
    } catch (error) {
        console.error('Error updating exercise:', error);
        throw error; // Rethrow the error for handling by the caller
    }
}



// Save a workout session
export async function saveWorkoutSession(sessionId, exercises) {

    console.log("Sending to server:", { sessionId, exercises });

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

// Duplicate a Workout Session
export async function duplicateWorkoutSession(sessionId) {
    const url = `${API_URL}/duplicate-session/${sessionId}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('[Client] Error duplicating workout session:', errorData);
            throw new Error(errorData || 'Duplicating workout session failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('[Client] Error in duplicateWorkoutSession:', error);
        throw error;
    }
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

