import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWorkoutSessions } from '../../api/apiHandlers';

const ClientWorkoutSessions = () => {
    const { clientId } = useParams(); // Assuming you're using URL params
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const loadSessions = async () => {
            try {
                const response = await fetchWorkoutSessions(clientId);
                console.log('Fetched workout sessions:', response); // Log the fetched data
                setSessions(response);
            } catch (error) {
                console.error('Error fetching workout sessions:', error);
                // Handle error (e.g., show error message)
            }
        };

        loadSessions();
    }, [clientId]);


    return (
        <div>
            <h2>Workout Sessions for Client {clientId}</h2>
            <ul>
                {sessions.map(session => (
                    <li key={session.SessionID}>
                        Date: {new Date(session.Date).toLocaleDateString()},
                        Description: {session.Description}
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default ClientWorkoutSessions;
