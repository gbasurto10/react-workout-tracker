import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWorkoutSessions, startNewWorkoutSession, fetchUserProfile } from '../../api/apiHandlers';
import { useNavigate } from 'react-router-dom';

const ClientWorkoutSessions = () => {
    const { clientId } = useParams();
    const [sessions, setSessions] = useState([]);
    const [clientName, setClientName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadSessions = async () => {
            try {
                const response = await fetchWorkoutSessions(clientId);
                setSessions(response.map(session => ({
                    ...session,
                    isFinished: Boolean(session.IsFinished) // This converts 1 or 0 to true/false
                })));
            } catch (error) {
                console.error('Error fetching workout sessions:', error);
            }
        };

        const fetchClientName = async () => {
            try {
                const clientData = await fetchUserProfile(clientId);
                setClientName(`${clientData.FirstName} ${clientData.LastName}`);
            } catch (error) {
                console.error('Error fetching client name:', error);
            }
        };

        loadSessions();
        fetchClientName();
    }, [clientId]);

    const handleSessionClick = (session) => {
        if (session.isFinished) {
            navigate(`/workout-session/${session.SessionID}/${clientId}`);
        } else {
            navigate(`/track-workout-session/${session.SessionID}/${clientId}`);
        }
    };

    const handleStartNewWorkout = async () => {
        try {
            const response = await startNewWorkoutSession(clientId);
            // Navigate to the TrackWorkoutSession component with the new session ID
            navigate(`/track-workout-session/${response.SessionID}/${clientId}`);
        } catch (error) {
            console.error('Error starting new workout session:', error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <div>
            <h2>Workout Sessions for {clientName}</h2>
            <button onClick={handleStartNewWorkout}>Start New Workout</button>
            <ul>
                {sessions.map(session => (
                    <li key={session.SessionID} onClick={() => handleSessionClick(session)} style={{ cursor: 'pointer' }}>
                        Date: {new Date(session.Date).toLocaleDateString()},
                        Description: {session.Description},
                        Status: {session.isFinished ? "Finished" : "In Progress"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientWorkoutSessions;
