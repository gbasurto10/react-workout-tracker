import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ClientScreen from './components/tracking-components/ClientScreen';
import ClientWorkoutSessions from './components/tracking-components/ClientWorkoutSessions'; // Import the component

function App() {
  const appStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'clear'
  }

  return (
    <Router>
      <div style={appStyles}>
        <Routes>
          <Route exact path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/clients" element={<ClientScreen />} />
          <Route path="/client-workout-sessions/:clientId" element={<ClientWorkoutSessions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
