// WorkoutSession.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { fetchSessionDetails, deleteWorkoutSession } from '../../api/apiHandlers';

const WorkoutSession = () => {
    // Inside your component
    const { sessionId, clientId } = useParams();
    const [sessionDetails, setSessionDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSessionDetails = async () => {
            try {
                const response = await fetchSessionDetails(sessionId);
                // Process the response to group sets by exercise
                const exercisesWithSets = response.Exercises.reduce((acc, current) => {
                    const { ExerciseID, Name, Type, SetNumber, Reps, Weight } = current;
                    const foundExercise = acc.find(ex => ex.ExerciseID === ExerciseID);
                    const set = { SetNumber, Reps, Weight };
                    if (foundExercise) {
                        foundExercise.Sets.push(set);
                    } else {
                        acc.push({
                            ExerciseID,
                            Name,
                            Type,
                            Sets: [set]
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
        <div>
            <h2>Workout Session Details - Session ID: {sessionDetails.SessionID}</h2>
            <p>Date: {new Date(sessionDetails.Date).toLocaleDateString()}</p>
            <p>Description: {sessionDetails.Description}</p>
            {sessionDetails.Exercises.map((exercise) => (
                <div key={exercise.ExerciseID}>
                    <h3>{exercise.Name} ({exercise.Type})</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Set</th>
                                <th>Reps</th>
                                <th>Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercise.Sets.map((set, index) => (
                                <tr key={index}>
                                    <td>{set.SetNumber}</td>
                                    <td>{set.Reps}</td>
                                    <td>{set.Weight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            <button onClick={() => {
                if (window.confirm('Are you sure you want to delete this workout?')) {
                    deleteWorkoutSession(sessionDetails.SessionID, clientId)
                        .then(clientId => navigate(`/client-workout-sessions/${clientId}`))
                        .catch(err => console.error(err));
                }
            }}>Delete Workout</button>
        </div>
    );
};

export default WorkoutSession;
