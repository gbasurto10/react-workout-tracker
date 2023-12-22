import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ClientScreen from './components/tracking-components/ClientScreen';
import ClientWorkoutSessions from './components/tracking-components/ClientWorkoutSessions';
import WorkoutSession from './components/tracking-components/WorkoutSession';
import TrackWorkoutSession from './components/tracking-components/TrackWorkoutSession';
import CreateClient from './components/tracking-components/CreateClient';
import ExerciseLibrary from './components/tracking-components/ExerciseLibrary';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowLeft, faBook } from '@fortawesome/free-solid-svg-icons';

function BackButton() {
  let navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <button onClick={goBack} className="back-button">
      <FontAwesomeIcon icon={faArrowLeft} /> {/* Replace text with icon */}
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
    <button onClick={handleLogout} className="logout-button">Logout</button>
  );
}

function Footer() {
  return (
    <footer className="app-footer">
      <Link to="/clients">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <Link to="/exercise-library">
        <FontAwesomeIcon icon={faBook} />
      </Link>
    </footer>
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
        <nav className="navbar">
          <div>
            {!isClientScreen && <BackButton />}
          </div>
          <LogoutButton />
        </nav>
      )}
      <div className="main-content">
        <Routes>
          <Route exact path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/clients" element={<ClientScreen />} />
          <Route path="/client-workout-sessions/:clientId" element={<ClientWorkoutSessions />} />
          <Route path="/workout-session/:sessionId/:clientId" element={<WorkoutSession />} />
          <Route path="/track-workout-session/:sessionId/:clientId" element={<TrackWorkoutSession />} />
          <Route path="/ClientWorkoutSessions" element={<ClientWorkoutSessions />} />
          <Route path="/create-client" element={<CreateClient />} />
          <Route path="/exercise-library" element={<ExerciseLibrary />} />
        </Routes>
      </div>
      {location.pathname !== '/' && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

export default App;