import React, { useState } from 'react';
import { loginUser } from '../api/apiHandlers';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginUser(email, password);

            if (response.success) {
                console.log('Login successful:', response);
                // Store the token, for example in localStorage (for simplicity)
                localStorage.setItem('token', response.token);

                // Redirect or update state here
                // For example: navigate to a different screen or update user context

            } else {
                // If the response does not indicate success, set an error message
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            // Handle errors (e.g., show error message)
            setError('Failed to log in. Please check your credentials.');
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };


    return (
        <div style={styles.loginScreen}>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <div style={styles.errorMessage}>{error}</div>}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button type="submit" style={styles.button}>Login</button>
                    <button type="button" onClick={handleRegisterClick} style={styles.button}>Register</button>
                </div>
            </form>
        </div>
    );
};

export default LoginScreen;

const styles = {
    loginScreen: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#clear'
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        justifyContent: 'center',
    },
    input: {
        width: '200px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '10px',
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
    }
};