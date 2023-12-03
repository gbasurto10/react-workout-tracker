import React, { useState, useEffect } from 'react';
import { fetchClientsProfiles } from '../../api/apiHandlers';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';

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
        <div className="container">
            <h1 className="header">Clients</h1>
            <div className="client-list">
                {clients.map(client => (
                    <div
                        key={client.UserID}
                        onClick={() => navigateToClientWorkoutSessions(client.UserID)}
                        className="client-item"
                    >
                        <div className="client-avatar">
                            {/* Placeholder for client avatar */}
                        </div>
                        <div className="client-info">
                            <h2>{client.FirstName} {client.LastName}</h2>
                            {/* Additional client info here */}
                        </div>
                    </div>
                ))}
            </div>
            <div className="button-container">
                <button className="button" onClick={navigateToCreateClient}>
                    Create New Client
                </button>
            </div>
        </div>
    );
};

export default ClientScreen;
