import React, { useState, useEffect } from 'react';
import { fetchClientsProfiles } from '../../api/apiHandlers';
import { useNavigate } from 'react-router-dom';

const ClientScreen = () => {
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();
    const trainerId = localStorage.getItem('userId');


    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const data = await fetchClientsProfiles();
            const trainerIdNumber = Number(trainerId); // Convert trainerId to a number
            const filteredClients = data.filter(client => client.TrainerUserID === trainerIdNumber); // Filter clients
            setClients(filteredClients);
            console.log("Filtered client data:", filteredClients)
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const navigateToClientWorkoutSessions = (clientId) => {
        navigate(`/client-workout-sessions/${clientId}`); // Update the path as per your routing setup
    };

    const navigateToCreateClient = () => {
        navigate('/create-client'); // Replace with the actual path to your create client screen
    };

    return (
        <div>
            <h1>Clients</h1>
            <ul>
                {clients.map(client => (
                    <li key={client.UserID} onClick={() => navigateToClientWorkoutSessions(client.UserID)} style={{ cursor: 'pointer' }}>
                        {client.FirstName} {client.LastName}
                    </li>
                ))}
            </ul>
            <button onClick={navigateToCreateClient}>Create New Client</button>
        </div>
    );
};

export default ClientScreen;
