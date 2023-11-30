import React, { useState, useEffect } from 'react';
import { registerUser, createClientProfile, fetchTrainers } from '../../api/apiHandlers';
import { useNavigate } from 'react-router-dom';


const CreateClient = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [trainers, setTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState('');


    const handleRegister = async () => {
        try {
            // Step 1: Register the user account
            const userType = 'client';
            const registerResponse = await registerUser(email, password, userType, firstName, lastName);

            // Log the response from registerUser
            console.log('Register User Response:', registerResponse);

            // Check if registration was successful and we have a userId
            if (registerResponse && registerResponse.userId) {
                const userId = registerResponse.userId;

                // Step 2: Create the client profile
                const clientData = {
                    UserID: userId,
                    FirstName: firstName,
                    LastName: lastName,
                    TrainerUserID: selectedTrainer
                };
                const profileResponse = await createClientProfile(clientData);

                // Log the response from createClientProfile
                console.log('Create Client Profile Response:', profileResponse);

                // Redirect to the clients page
                navigate('/clients');
            } else {
                // Handle the case where userId is not returned
                setError('Registration failed, cannot create profile.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
            // Handle errors from either registration or profile creation
        }
    };

    useEffect(() => {
        const loadTrainers = async () => {
            try {
                const response = await fetchTrainers();
                if (response.success) {
                    setTrainers(response.trainers);

                    // Console log the fetched trainer data
                    console.log('Fetched Trainers:', response.trainers);
                } else {
                    setError('Failed to load trainers.');
                }
            } catch (err) {
                console.error('Error:', err);
                setError('Failed to load trainers.');
            }
        };

        loadTrainers();
    }, []);

    const handleTrainerChange = (e) => {
        setSelectedTrainer(e.target.value);
        // Find the selected trainer in the trainers array and log their details
        const selectedTrainerDetails = trainers.find(trainer => trainer.id.toString() === e.target.value);
        console.log('Selected Trainer:', selectedTrainerDetails);
    };



    return (
        <div>
            {/* Form Inputs for Email, Password, FirstName, LastName */}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
            <div>
                <label htmlFor="trainerSelect">Assign Trainer:</label>
                <select
                    id="trainerSelect"
                    value={selectedTrainer}
                    onChange={handleTrainerChange}
                >
                    <option value="">Select a Trainer</option>
                    {trainers.map(trainer => (
                        <option key={trainer.id} value={trainer.id}>
                            {trainer.firstName} {trainer.lastName}
                        </option>
                    ))}
                </select>

            </div>
            <button onClick={handleRegister}>Create Account and Profile</button>
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default CreateClient;
