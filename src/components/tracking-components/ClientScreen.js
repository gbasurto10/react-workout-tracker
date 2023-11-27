import React, { useState, useEffect } from 'react';
import { fetchClientsProfiles } from '../../api/apiHandlers';
import { useNavigate } from 'react-router-dom';
const ClientScreen = () => {
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const data = await fetchClientsProfiles();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const navigateToCreateClient = () => {
        navigate.push('/create-client'); // Replace '/create-client' with the actual path to your create client screen
    };

    return (
        <div>
            <h1>Clients</h1>
            <ul>
                {clients.map(client => (
                    <li key={client.UserID}>
                        {client.FirstName} {client.LastName}
                    </li>
                ))}
            </ul>
            <button onClick={navigateToCreateClient}>Create New Client</button>
        </div>
    );
};

export default ClientScreen;
