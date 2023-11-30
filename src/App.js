import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ClientScreen from './components/tracking-components/ClientScreen';
import ClientWorkoutSessions from './components/tracking-components/ClientWorkoutSessions';
import WorkoutSession from './components/tracking-components/WorkoutSession';
import TrackWorkoutSession from './components/tracking-components/TrackWorkoutSession';
import CreateClient from './components/tracking-components/CreateClient';

function BackButton() {
  let navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <button onClick={goBack} style={{ marginRight: '10px', cursor: 'pointer', border: 'none', background: 'transparent' }}>
      &#8592; Back
    </button>
  );
}

function LogoutButton() {
  let navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication tokens or user data here
    // For example, if using localStorage:
    localStorage.removeItem('userToken');

    // Redirect to the login page
    navigate('/');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

function Main() {
  const navStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // This will space out the items
    width: '100%',
    padding: '10px'
  };

  let location = useLocation();

  // Determine if the current path is the ClientScreen
  const isClientScreen = location.pathname.startsWith('/clients');

  return (
    <>
      {location.pathname !== '/' && (
        <nav style={navStyles}>
          <div>
            {!isClientScreen && <BackButton />}
            {!isClientScreen && <Link to="/clients">Home</Link>}
          </div>
          <LogoutButton />
        </nav>
      )}
      <Routes>
        <Route exact path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/clients" element={<ClientScreen />} />
        <Route path="/client-workout-sessions/:clientId" element={<ClientWorkoutSessions />} />
        <Route path="/workout-session/:sessionId/:clientId" element={<WorkoutSession />} />
        <Route path="/track-workout-session/:sessionId/:clientId" element={<TrackWorkoutSession />} />
        <Route path="/ClientWorkoutSessions" element={<ClientWorkoutSessions />} />
        <Route path="/create-client" element={<CreateClient />} />
      </Routes>
    </>
  );
}

function App() {
  const appStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'clear'
  };

  return (
    <Router>
      <div style={appStyles}>
        <Main />
      </div>
    </Router>
  );
}

export default App;
