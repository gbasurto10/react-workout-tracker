import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWorkoutSessions } from '../api/apiHandlers';

const ClientWorkoutSessions = () => {
    const { clientId } = useParams(); // Assuming you're using URL params
    const [sessions, setSessions] = useState([]);

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

    return (
        <div>
            <h2>Workout Sessions for Client {clientId}</h2>
            <ul>
                {sessions.map(session => (
                    <li key={session.id}>
                        {/* Render session details */}
                        Date: {session.date}, Notes: {session.notes}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientWorkoutSessions;
