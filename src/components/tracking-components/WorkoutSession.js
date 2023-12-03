// WorkoutSession.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { fetchSessionDetails, deleteWorkoutSession, updateWorkoutSession } from '../../api/apiHandlers';

const WorkoutSession = () => {
    // Inside your component
    const { sessionId, clientId } = useParams();
    const [sessionDetails, setSessionDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSessionDetails = async () => {
            try {
                const response = await fetchSessionDetails(sessionId);
                // Process the response to group sets by exercise and SupersetID
                const exercisesWithSets = response.Exercises.reduce((acc, current) => {
                    const { ExerciseID, Name, Type, SetNumber, Reps, Weight, SupersetID } = current;
                    const set = { SetNumber, Reps, Weight };
                    const foundExercise = acc.find(ex => ex.ExerciseID === ExerciseID && ex.SupersetID === SupersetID);
                    if (foundExercise) {
                        foundExercise.Sets.push(set);
                    } else {
                        acc.push({
                            ExerciseID,
                            Name,
                            Type,
                            Sets: [set],
                            SupersetID
                        });
                    }
                    return acc;
                }, []);
                setSessionDetails({ ...response, Exercises: exercisesWithSets });
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
    
            {/* Filter and render non-superset exercises first */}
            {sessionDetails.Exercises.filter(exercise => exercise.SupersetID === null).map((exercise, index) => (
                <div key={exercise.ExerciseID} className="exercise-container">
                    <h4 className="exercise-header">{exercise.Name}</h4>
                    <table className="workout-table">
                        <thead>
                            <tr>
                                <th>Set</th>
                                <th>Reps</th>
                                <th>Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercise.Sets.map((set, setIndex) => (
                                <tr key={setIndex}>
                                    <td>{set.SetNumber}</td>
                                    <td>{set.Reps}</td>
                                    <td>{set.Weight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
    
            {/* Then find and render supersets */}
            {sessionDetails.Exercises
                .filter((exercise, index, self) =>
                    exercise.SupersetID !== null &&
                    index === self.findIndex(e => e.SupersetID === exercise.SupersetID)
                )
                .map(supersetExercise => {
                    const exercisesInSuperset = sessionDetails.Exercises.filter(e => e.SupersetID === supersetExercise.SupersetID);
                    return (
                        <div key={`superset-${supersetExercise.SupersetID}`} className="superset-container">
                            <h3 className="superset-header">Superset</h3>
                            {exercisesInSuperset.map(exercise => (
                                <div key={exercise.ExerciseID} className="exercise-container">
                                    <h4 className="exercise-header">{exercise.Name}</h4>
                                    <table className="workout-table">
                                        <thead>
                                            <tr>
                                                <th>Set</th>
                                                <th>Reps</th>
                                                <th>Weight</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {exercise.Sets.map((set, setIndex) => (
                                                <tr key={setIndex}>
                                                    <td>{set.SetNumber}</td>
                                                    <td>{set.Reps}</td>
                                                    <td>{set.Weight}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    );
                })
            }
    
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
        </div>
    );
    
    

};

export default WorkoutSession;
