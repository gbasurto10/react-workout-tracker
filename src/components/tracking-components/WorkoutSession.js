// WorkoutSession.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { fetchSessionDetails, deleteWorkoutSession, updateWorkoutSession, duplicateWorkoutSession } from '../../api/apiHandlers';

const WorkoutSession = () => {
    // Inside your component
    const { sessionId, clientId } = useParams();
    const [sessionDetails, setSessionDetails] = useState(null);
    const navigate = useNavigate();
    const isSuperset = (exercise, exercises) => {
        return exercises.some(e => e.SupersetID === exercise.SupersetID && e.ExerciseID !== exercise.ExerciseID);
    };

    useEffect(() => {
        const loadSessionDetails = async () => {
            try {
                const response = await fetchSessionDetails(sessionId);
                // Process the response to group sets by exercise and SupersetID
                const exercisesWithSets = response.Exercises.reduce((acc, current) => {
                    const { ExerciseID, Name, Type, SetNumber, Reps, Weight, Distance, Time, SupersetID } = current;
                    const set = { SetNumber, Reps, Weight, Distance, Time };
                    const foundExercise = acc.find(ex => ex.ExerciseID === ExerciseID && ex.SupersetID === SupersetID);
                    if (foundExercise) {
                        foundExercise.Sets.push(set);
                    } else {
                        acc.push({
                            ExerciseID,
                            Name,
                            Type,
                            Sets: [set],
                            SupersetID,
                            OrderID: current.OrderID // Include OrderID here
                        });
                    }
                    return acc;
                }, []);

                // Sort the exercises by OrderID
                exercisesWithSets.sort((a, b) => a.OrderID - b.OrderID);

                setSessionDetails({ ...response, Exercises: exercisesWithSets });
                console.log('Session details:', response);
            } catch (error) {
                console.error('Error fetching session details:', error);
            }
        };

        loadSessionDetails();
    }, [sessionId]);


    if (!sessionDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="workout-session-container">
            <h2 className="header">Workout Session Details - Session ID: {sessionDetails.SessionID}</h2>
            <p className="workout-session-description">Date: {new Date(sessionDetails.Date).toLocaleDateString()}</p>
            <p className="workout-session-description">Description: {sessionDetails.Description}</p>

            {sessionDetails.Exercises.map((exercise, index) => {
                // Check if this is the first exercise of a superset
                if (exercise.SupersetID && sessionDetails.Exercises.findIndex(e => e.SupersetID === exercise.SupersetID) === index) {
                    // Render the superset header and exercises
                    const exercisesInSuperset = sessionDetails.Exercises.filter(e => e.SupersetID === exercise.SupersetID);
                    return (
                        <div key={`superset-${exercise.SupersetID}`} className="superset-container">
                            <h3 className="superset-header">Superset {exercise.SupersetID}</h3>
                            {exercisesInSuperset.map(supersetExercise => (
                                <div key={supersetExercise.ExerciseID} className="exercise-container">
                                    <h4 className="exercise-header">{supersetExercise.Name}</h4>
                                    {/* Render the table for the superset exercise */}
                                    <table className="workout-table">
                                        <thead>
                                            <tr>
                                                <th>Set</th>
                                                {supersetExercise.Sets[0].Reps !== null ? <th>Reps</th> : null}
                                                {supersetExercise.Sets[0].Weight !== null ? <th>Weight</th> : null}
                                                {supersetExercise.Sets[0].Distance !== null ? <th>Distance</th> : null}
                                                {supersetExercise.Sets[0].Time !== null ? <th>Time</th> : null}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {supersetExercise.Sets.map((set, setIndex) => (
                                                <tr key={setIndex}>
                                                    <td>{set.SetNumber}</td>
                                                    {set.Reps !== null ? <td>{set.Reps}</td> : null}
                                                    {set.Weight !== null ? <td>{set.Weight}</td> : null}
                                                    {set.Distance !== null ? <td>{set.Distance}</td> : null}
                                                    {set.Time !== null ? <td>{set.Time}</td> : null}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    );
                } else if (!exercise.SupersetID) {
                    // Render non-superset exercises
                    return (
                        <div key={exercise.ExerciseID} className="exercise-container">
                            <h4 className="exercise-header">{exercise.Name}</h4>
                            {/* Render the table for the non-superset exercise */}
                            <table className="workout-table">
                                <thead>
                                    <tr>
                                        <th>Set</th>
                                        {exercise.Sets[0].Reps !== null ? <th>Reps</th> : null}
                                        {exercise.Sets[0].Weight !== null ? <th>Weight</th> : null}
                                        {exercise.Sets[0].Distance !== null ? <th>Distance</th> : null}
                                        {exercise.Sets[0].Time !== null ? <th>Time</th> : null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {exercise.Sets.map((set, setIndex) => (
                                        <tr key={setIndex}>
                                            <td>{set.SetNumber}</td>
                                            {set.Reps !== null ? <td>{set.Reps}</td> : null}
                                            {set.Weight !== null ? <td>{set.Weight}</td> : null}
                                            {set.Distance !== null ? <td>{set.Distance}</td> : null}
                                            {set.Time !== null ? <td>{set.Time}</td> : null}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }
                // If it is not the first exercise of a superset, we don't render it again.
                return null;
            })}

            {/* Delete and Update Workout Buttons */}
            <button onClick={() => {
                if (window.confirm('Are you sure you want to delete this workout?')) {
                    deleteWorkoutSession(sessionDetails.SessionID, clientId)
                        .then(() => navigate(`/client-workout-sessions/${clientId}`))
                        .catch(err => console.error('Error deleting workout session:', err));
                }
            }}>Delete Workout</button>
            <button onClick={() => {
                updateWorkoutSession(sessionDetails.SessionID)
                    .then(() => navigate(`/track-workout-session/${sessionDetails.SessionID}/${clientId}`))
                    .catch(err => console.error('Error updating workout session:', err));
            }}>Update Workout</button>
            <button onClick={() => {
                duplicateWorkoutSession(sessionDetails.SessionID)
                    .then(response => {
                        // Handle success. For example, navigate to the new session's detail page or refresh the current page
                        console.log('Duplicated session successfully', response);
                        const newSessionId = response.newSessionId; // Assuming the response contains the new session ID

                        // Option 1: Navigate to the new duplicated session's detail page (if you have such a route)
                        navigate(`/track-workout-session/${newSessionId}/${clientId}`);

                        // Option 2: Refresh the current page or workout sessions list
                        // window.location.reload(); // Or any other method to refresh the data
                    })
                    .catch(err => {
                        // Handle any errors that occurred during the duplication process
                        console.error('Error duplicating workout session:', err);
                        alert('Failed to duplicate the session. Please try again.'); // Simple error feedback
                    });
            }}>Duplicate Workout</button>
        </div>
    );





};

export default WorkoutSession;
