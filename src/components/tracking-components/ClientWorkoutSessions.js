import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWorkoutSessions } from '../../api/apiHandlers';
import { useNavigate } from 'react-router-dom';

const ClientWorkoutSessions = () => {
    const { clientId } = useParams(); // Assuming you're using URL params
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSessions = async () => {
            try {
                const response = await fetchWorkoutSessions(clientId);
                setSessions(response);
            } catch (error) {
                console.error('Error fetching workout sessions:', error);
                // Handle error (e.g., show error message)
            }
        };

        loadSessions();
    }, [clientId]);

    const handleSessionClick = (sessionId) => {
        navigate(`/workout-session/${sessionId}`);
    };


    return(
        <div>
            <h2>Workout Sessions for Client {clientId}</h2>
            <ul>
                {sessions.map(session => (
                    <li key={session.SessionID} onClick={() => handleSessionClick(session.SessionID)} style={{ cursor: 'pointer' }}>
                        Date: {new Date(session.Date).toLocaleDateString()},
                        Description: {session.Description}
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default ClientWorkoutSessions;
