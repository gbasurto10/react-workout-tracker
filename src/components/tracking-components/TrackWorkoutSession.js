// TrackWorkoutSession.js
import React, { useState, useEffect } from 'react';
import { fetchExercises, createNewExercise, saveWorkoutSession, finishWorkoutSession, deleteWorkoutSession, fetchSessionExercises } from '../../api/apiHandlers';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const defaultExercise = {
    name: '',
    type: '',
    sets: [{ reps: '', weight: '' }],
};

const TrackWorkoutSession = () => {
    const [sessionDetails, setSessionDetails] = useState(null);
    const [exercises, setExercises] = useState([defaultExercise]);
    const [availableExercises, setAvailableExercises] = useState([]);
    const { sessionId } = useParams();
    const { clientId } = useParams();
    const navigate = useNavigate();

    // Fetch session exercises when the component mounts
    useEffect(() => {
        const loadSessionExercises = async () => {
          try {
            const sessionExercisesData = await fetchSessionExercises(sessionId);
      
            // Group sets by ExerciseID
            const groupedExercises = sessionExercisesData.reduce((acc, current) => {
              const { ExerciseID, Name, Type, SessionExerciseID, Reps, Weight } = current;
              // If the exercise hasn't been added to the accumulator, add it
              if (!acc[ExerciseID]) {
                acc[ExerciseID] = {
                  id: ExerciseID,
                  name: Name,
                  type: Type,
                  sets: [],
                };
              }
              // Push the current set to the exercise entry
              acc[ExerciseID].sets.push({
                sessionExerciseID: SessionExerciseID, // Use SessionExerciseID to maintain the unique identifier for each set
                reps: Reps,
                weight: Weight,
              });
              return acc;
            }, {});
      
            // Convert the grouped exercises object back to an array
            const exercisesArray = Object.values(groupedExercises);
      
            // Sort sets for each exercise by SessionExerciseID
            exercisesArray.forEach(exercise => {
              exercise.sets.sort((a, b) => a.sessionExerciseID - b.sessionExerciseID);
              console.log(`Existing sets for exercise ${exercise.name}:`, exercise.sets);
            });
      
            setExercises(exercisesArray);
          } catch (err) {
            console.error('Error loading session exercises:', err);
          }
        };
      
        loadSessionExercises();
      }, [sessionId]);
      



    // Function to load exercises
    const loadExercises = async () => {
        const exercisesData = await fetchExercises();
        setAvailableExercises(exercisesData);
    };

    // Load exercises when the component mounts
    useEffect(() => {
        loadExercises();
    }, []);

    const handleExerciseChange = (index, selectedExerciseID) => {
        console.log("Selected Exercise ID:", selectedExerciseID);
        console.log("Available Exercises:", availableExercises);

        const newExercises = [...exercises];
        const selectedExercise = availableExercises.find(ex => ex.ExerciseID.toString() === selectedExerciseID);

        if (!selectedExercise) {
            console.error("Selected exercise not found in available exercises");
            return;
        }

        newExercises[index] = {
            ...newExercises[index],
            id: selectedExerciseID,
            name: selectedExercise.Name,
            type: selectedExercise.Type
        };
        setExercises(newExercises);
    };



    function handleSetChange(exerciseIndex, setIndex, field, value) {
        setExercises(prevExercises => {
            // Create a deep copy of the exercises
            const newExercises = JSON.parse(JSON.stringify(prevExercises));
            newExercises[exerciseIndex].sets[setIndex][field] = value;
            return newExercises;
        });
    }

    const addExercise = () => {
        setExercises([...exercises, defaultExercise]);
    };

    const addSet = (exerciseIndex) => {
        const newExercises = [...exercises];
        newExercises[exerciseIndex].sets.push({ reps: '', weight: '' });
        setExercises(newExercises);
    };

    const removeExercise = (index) => {
        const newExercises = exercises.filter((_, i) => i !== index);
        setExercises(newExercises);
    };

    const removeSet = (exerciseIndex, setIndex) => {
        const newExercises = [...exercises];
        newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
        setExercises(newExercises);
    };

    // Prepare exercises for saving
    function prepareExercisesForSave() {
        return exercises.map((exercise, exerciseIndex) => {
            // Assuming you have an exercise ID stored in your state
            const exerciseID = exercise.id; // Replace with actual ID from your state

            return {
                ExerciseID: exerciseID,
                sets: exercise.sets.map((set, setIndex) => ({
                    SetNumber: setIndex + 1, // Example of generating a SetNumber
                    Reps: set.reps,
                    Weight: set.weight
                }))
            };
        });
    }



    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Your existing logic to save the workout session
            const preparedExercises = prepareExercisesForSave();
            await saveWorkoutSession(sessionId, preparedExercises);

            // Mark the session as finished
            await finishWorkoutSession(sessionId);

            console.log('Workout session saved and marked as finished');
            // Handle post-save actions (e.g., navigate or show a message)

            navigate(`/client-workout-sessions/${clientId}`);

        } catch (error) {
            console.error('Error in saving or finishing workout session:', error);
            // Handle error
        }
    };


    const handleAddNewExercise = async () => {
        const newExerciseName = prompt('Enter the name of the new exercise:');
        if (newExerciseName) {
            await createNewExercise({ name: newExerciseName, type: 'Strength' }); // example type
            await loadExercises(); // reload exercises after adding a new one
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <h2>Track Workout Session</h2>
            {exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex}>
                    <select
                        value={exercise.id || ''}
                        onChange={(e) => handleExerciseChange(exerciseIndex, e.target.value)}
                    >
                        <option value="">Select an exercise</option>
                        {availableExercises.map((ex, index) => (
                            <option key={index} value={ex.ExerciseID}>{ex.Name}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => removeExercise(exerciseIndex)}>
                        Remove Exercise
                    </button>
                    {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex}>
                            <input
                                type="number"
                                placeholder="Reps"
                                value={set.reps || ''}
                                onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Weight"
                                value={set.weight || ''}
                                onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                            />
                            <button type="button" onClick={() => removeSet(exerciseIndex, setIndex)}>
                                Remove Set
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addSet(exerciseIndex)}>
                        Add Set
                    </button>
                </div>
            ))}
            <button type="button" onClick={addExercise}>Add Exercise</button>
            <button type="button" onClick={handleAddNewExercise}>Create New Exercise</button>
            <button type="submit" onClick={handleSubmit}>Save Workout</button>
            <button onClick={() => {
                if (window.confirm('Are you sure you want to delete this workout?')) {
                    deleteWorkoutSession(sessionId, clientId)
                        .then(clientId => navigate(`/client-workout-sessions/${clientId}`))
                        .catch(err => console.error(err));
                }
            }}>Delete Workout</button>
        </form>
    );
};

export default TrackWorkoutSession;
