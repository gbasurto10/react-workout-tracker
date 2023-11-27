// WorkoutSession.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSessionDetails } from '../../api/apiHandlers';

const WorkoutSession = () => {
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);

    useEffect(() => {
        const loadSessionDetails = async () => {
            try {
                const response = await fetchSessionDetails(sessionId);
                console.log('Session Details:', response); // Log the session details here
                setSession(response);
            } catch (error) {
                console.error('Error fetching session details:', error);
                // Handle error
            }
        };

        loadSessionDetails();
    }, [sessionId]);

    if (!session) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Workout Session Details</h2>
            {/* Render session details here */}
        </div>
    );
};

export default WorkoutSession;
