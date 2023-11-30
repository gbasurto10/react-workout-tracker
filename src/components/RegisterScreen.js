import React, { useState } from 'react';
import { registerUser } from '../api/apiHandlers';
import { useNavigate } from 'react-router-dom';


const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('trainer');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const response = await registerUser(email, password, userType, firstName, lastName);
            if (response.success) {
                setSuccess(true);
                console.log('Registration successful:', response);
                navigate('/'); // Redirect to the login page
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Failed to register. Please check your credentials.');
        }
    };

    return (
        <div style={styles.registerScreen}>
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                {error && <div style={styles.errorMessage}>{error}</div>}
                {success && <div style={styles.successMessage}>Registration successful!</div>}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <label style={styles.label}>First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <label style={styles.label}>Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Register</button>
            </form>
        </div>
    );
};

const styles = {
    registerScreen: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'clear'
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '10px'
    },
    errorMessage: {
        color: 'red',
        marginBottom: '15px',
    },
    successMessage: {
        color: 'green',
        marginBottom: '15px',
    }
};

export default RegisterScreen;
