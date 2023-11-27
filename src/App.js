import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ClientScreen from './components/tracking-components/ClientScreen';
import ClientWorkoutSessions from './components/tracking-components/ClientWorkoutSessions';
import WorkoutSession from './components/tracking-components/WorkoutSession';
import TrackWorkoutSession from './components/tracking-components/TrackWorkoutSession'; // Import the new component

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
          <Route path="/workout-session/:sessionId" element={<WorkoutSession />} />
          <Route path="/track-workout-session/:sessionId" element={<TrackWorkoutSession />} /> {/* New route for tracking workout sessions */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
