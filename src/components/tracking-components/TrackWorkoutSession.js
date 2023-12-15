// TrackWorkoutSession.js
import React, { useState, useEffect } from 'react';
import {
    fetchExercises,
    createNewExercise,
    saveWorkoutSession,
    finishWorkoutSession,
    deleteWorkoutSession,
    fetchSessionExercises,
    fetchExerciseHistory
} from '../../api/apiHandlers';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';



const defaultExercise = {
    name: '',
    type: '',
    sets: [{ reps: '', weight: '' }],
    inputValue: ''
};


const TrackWorkoutSession = () => {
    const [sessionDetails, setSessionDetails] = useState(null);
    const [exercises, setExercises] = useState([defaultExercise]);
    const [availableExercises, setAvailableExercises] = useState([]);
    const { sessionId } = useParams();
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [currentSupersetId, setCurrentSupersetId] = useState(1);
    const [newSupersetSize, setNewSupersetSize] = useState(0);
    const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState({});







    // Mock exercise history data
    const mockExerciseHistory = [
        { date: "2023-03-01", exercise: "Squats", sets: 3, reps: 12, weight: 100 },
        { date: "2023-03-05", exercise: "Deadlift", sets: 4, reps: 10, weight: 150 },
    ];
    const slideOverStyles = {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '300px',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'white',
        boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.5)',
        padding: '20px',
        boxSizing: 'border-box',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
    };


    const slideOverOpenStyles = {
        transform: 'translateX(0)',
    };





    // Fetch session exercises when the component mounts
    useEffect(() => {
        const loadSessionExercises = async () => {
            try {
                let sessionExercisesData = await fetchSessionExercises(sessionId);
                console.log("Session Exercises Data:", sessionExercisesData);

                // Sort by OrderID
                sessionExercisesData.sort((a, b) => a.OrderID - b.OrderID);

                // Find the maximum SupersetID to correctly initialize currentSupersetId
                const maxSupersetId = sessionExercisesData.reduce((max, curr) => {
                    return (curr.SupersetID && curr.SupersetID > max) ? curr.SupersetID : max;
                }, 0);
                setCurrentSupersetId(maxSupersetId + 1);

                // Group exercises by SupersetID then by ExerciseID
                let supersets = {};
                sessionExercisesData.forEach(exercise => {
                    const supersetKey = exercise.SupersetID ? `superset-${exercise.SupersetID}` : `exercise-${exercise.ExerciseID}`;
                    const exerciseKey = `exercise-${exercise.ExerciseID}`;

                    if (!supersets[supersetKey]) {
                        supersets[supersetKey] = {};
                    }

                    if (!supersets[supersetKey][exerciseKey]) {
                        supersets[supersetKey][exerciseKey] = {
                            id: exercise.ExerciseID,
                            name: exercise.Name,
                            type: exercise.Type, // Assuming there is a type field
                            sets: [],
                            supersetId: exercise.SupersetID,
                            order: exercise.OrderID, // Keep track of order
                        };
                    }

                    supersets[supersetKey][exerciseKey].sets.push({
                        sessionExerciseID: exercise.SessionExerciseID,
                        reps: exercise.Reps,
                        weight: exercise.Weight,
                        setNumber: exercise.SetNumber
                    });
                });

                // Flatten the supersets into a sorted array
                let exercisesArray = [];
                Object.values(supersets).forEach(superset => {
                    Object.values(superset).forEach(exercise => {
                        exercisesArray.push({
                            ...exercise,
                            sets: exercise.sets.sort((a, b) => a.setNumber - b.setNumber) // Ensure sets are sorted
                        });
                    });
                });

                // Sort by OrderID to maintain the overall order
                exercisesArray.sort((a, b) => a.order - b.order);

                setExercises(exercisesArray);
            } catch (err) {
                console.error('Error loading session exercises:', err);
            }
        };

        // Load from local storage if available, otherwise load from the API
        const savedSession = localStorage.getItem('workoutSession');
        if (savedSession) {
            console.log('Loaded from localStorage:', savedSession);
            setExercises(JSON.parse(savedSession));
        } else {
            loadSessionExercises();
        }
    }, [sessionId]);








    // Function to load exercises
    const loadExercises = async () => {
        const exercisesData = await fetchExercises();

        exercisesData.sort((a, b) => a.Name.localeCompare(b.Name));

        setAvailableExercises(exercisesData);
    };

    // Load exercises when the component mounts
    useEffect(() => {
        loadExercises();
    }, []);

    // Handle exercise selection
    const handleExerciseSelect = (index, selectedExercise) => {
        const newExercises = [...exercises];
        newExercises[index] = {
            ...newExercises[index],
            id: selectedExercise.ExerciseID,
            name: selectedExercise.Name,
            type: selectedExercise.Type,
            inputValue: selectedExercise.Name // Keep the selected exercise name
        };
        setExercises(newExercises);
        setIsDropdownVisible({ ...isDropdownVisible, [index]: false }); // Hide the dropdown
    };







    const addExercise = () => {
        const newExercise = {
            ...defaultExercise,
            sets: [{ reps: '', weight: '' }],
            order: exercises.length + 1 // Assign the next OrderID
        };

        setExercises([...exercises, newExercise]);
    };



    const addSet = (exerciseIndex) => {
        console.log("Current sets for exercise at index", exerciseIndex, ":", exercises[exerciseIndex].sets);
        const newExercises = [...exercises];
        newExercises[exerciseIndex].sets.push({ reps: '', weight: '' });
        setExercises(newExercises);
    };

    const removeExercise = (index) => {
        const exerciseToRemove = exercises[index];
        console.log('Removing exercise:', exerciseToRemove, 'at index:', index);

        const newExercises = exercises.filter((_, i) => i !== index);
        setExercises(newExercises);

        // Save updated state to local storage
        localStorage.setItem('workoutSession', JSON.stringify(newExercises));
    };



    const removeSet = (exerciseIndex, setIndex) => {
        const setToRemove = exercises[exerciseIndex].sets[setIndex];
        console.log('Removing set:', setToRemove, 'from exercise at index:', exerciseIndex);

        const newExercises = [...exercises];
        newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
        setExercises(newExercises);

        // Save updated state to local storage
        localStorage.setItem('workoutSession', JSON.stringify(newExercises));
    };



    // Prepare exercises for saving
    function prepareExercisesForSave() {
        return exercises.map((exercise, index) => ({
            ExerciseID: exercise.id,
            SupersetID: exercise.supersetId || null,  // Include SupersetID, default to null if not present
            OrderID: index + 1,  // Assign OrderID based on the index in the array
            sets: exercise.sets.map((set, setIndex) => ({
                SetNumber: setIndex + 1,  // Assign set number based on the index
                Reps: set.reps,
                Weight: set.weight
            }))
        }));
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

            // Clear local storage
            localStorage.removeItem('workoutSession');

            navigate(`/client-workout-sessions/${clientId}`);

        } catch (error) {
            console.error('Error in saving or finishing workout session:', error);
            // Handle error
        }
    };

    const handleDeleteWorkout = () => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            deleteWorkoutSession(sessionId, clientId)
                .then(() => {
                    // Clear local storage
                    localStorage.removeItem('workoutSession');

                    navigate(`/client-workout-sessions/${clientId}`);
                })
                .catch(err => console.error(err));
        }
    };



    const handleAddNewExercise = async () => {
        const newExerciseName = prompt('Enter the name of the new exercise:');
        if (newExerciseName) {
            await createNewExercise({ name: newExerciseName, type: 'Strength' }); // example type
            await loadExercises(); // reload exercises after adding a new one
        }
    };

    const toggleSlideOver = async (exerciseId) => {
        if (!isSlideOverOpen) {
            await loadExerciseHistory(exerciseId);
            console.log("Exercise History:", exerciseHistory);
        }
        setIsSlideOverOpen(!isSlideOverOpen);
    };



    // Fetch Exercise History
    const loadExerciseHistory = async (exerciseId) => {
        try {
            const historyData = await fetchExerciseHistory(clientId, exerciseId);
            setExerciseHistory(historyData);
        } catch (err) {
            console.error('Error loading exercise history:', err);
            // Optionally, handle the error in the UI, e.g., show an error message
        }
    };

    const groupByDate = (history) => {
        return history.reduce((acc, item) => {
            const date = new Date(item.Date).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});
    };

    const groupedHistory = groupByDate(exerciseHistory);


    // Create a new superset
    const handleCreateSuperset = () => {
        const size = prompt("How many exercises to add to the superset?");
        if (size && !isNaN(size) && Number(size) > 0) {
            const supersetSize = Number(size);
            const supersetExercises = Array.from({ length: supersetSize }, () => ({
                ...defaultExercise,
                supersetId: currentSupersetId // Use the currentSupersetId
            }));

            // Add the new superset exercises to the existing ones
            setExercises([...exercises, ...supersetExercises]);
            // Increment the currentSupersetId to ensure the next one is unique
            setCurrentSupersetId(currentSupersetId + 1);
        } else {
            alert("Please enter a valid number.");
        }
    };



    // Move an exercise up
    const moveExerciseUp = (exerciseIndex) => {
        setExercises(prevExercises => {
            if (exerciseIndex === 0) return prevExercises; // Prevent moving the first item

            const newExercises = [...prevExercises];
            // Swap the exercises
            [newExercises[exerciseIndex - 1], newExercises[exerciseIndex]] = [newExercises[exerciseIndex], newExercises[exerciseIndex - 1]];

            // Update OrderID for swapped exercises
            newExercises[exerciseIndex - 1].order = exerciseIndex;
            newExercises[exerciseIndex].order = exerciseIndex + 1;

            return newExercises;
        });
    };

    // Move an exercise down
    const moveExerciseDown = (exerciseIndex) => {
        setExercises(prevExercises => {
            if (exerciseIndex >= prevExercises.length - 1) return prevExercises; // Prevent moving the last exercise

            const newExercises = [...prevExercises];
            // Swap the exercises
            [newExercises[exerciseIndex], newExercises[exerciseIndex + 1]] = [newExercises[exerciseIndex + 1], newExercises[exerciseIndex]];

            // Update OrderID for swapped exercises
            newExercises[exerciseIndex].order = exerciseIndex + 2;
            newExercises[exerciseIndex + 1].order = exerciseIndex + 1;

            return newExercises;
        });
    };

    // Keep track of the last superset ID
    let lastSupersetId = null;


    // Handle exercise change
    function handleSetChange(exerciseIndex, setIndex, field, value) {
        setExercises(prevExercises => {
            const newExercises = JSON.parse(JSON.stringify(prevExercises));
            newExercises[exerciseIndex].sets[setIndex][field] = value;

            const sessionData = {
                sessionId: sessionId || null,
                clientId: clientId || null,
                exercises: newExercises
            };

            localStorage.setItem('workoutSession', JSON.stringify(sessionData));
            console.log('Saved to localStorage:', sessionData);

            return newExercises;
        });
    }




    // Load from local storage when the component mounts
    useEffect(() => {
        const savedSession = localStorage.getItem('workoutSession');
        if (savedSession) {
            const sessionData = JSON.parse(savedSession);

            if ((sessionData.sessionId === sessionId || sessionData.sessionId === null) &&
                (sessionData.clientId === clientId || sessionData.clientId === null)) {

                // Check if sessionData.exercises is an array before setting it
                if (sessionData.exercises && Array.isArray(sessionData.exercises)) {
                    setExercises(sessionData.exercises);
                } else {
                    // Initialize exercises with defaultExercise if sessionData.exercises is not an array
                    setExercises([defaultExercise]);
                }

            } else {
                console.log('Session and client ID from local storage do not match the current session.');
                // Initialize exercises for a new session
                setExercises([defaultExercise]);
            }
        } else {
            // If there's no saved session, initialize with default exercise
            setExercises([defaultExercise]);
        }
    }, [sessionId, clientId]);


    // Handle exercise search
    const filterExercises = (inputValue) => {
        if (!inputValue.trim()) return [];
        return availableExercises.filter(exercise =>
            exercise.Name.toLowerCase().includes(inputValue.toLowerCase())
        );
    };


    // Handle exercise input change
    const handleExerciseInputChange = (index, value) => {
        const newExercises = [...exercises];
        newExercises[index].inputValue = value;
        setExercises(newExercises);
    };





    return (
        <form onSubmit={handleSubmit}>
            <div className="track-workout-container">
                <h2 className="header">Track Workout Session</h2>
                {exercises.map((exercise, exerciseIndex) => {
                    let supersetHeading = null;
                    if (exercise.supersetId && exercise.supersetId !== lastSupersetId) {
                        supersetHeading = <h3 className="superset-header">Superset {exercise.supersetId}</h3>;
                        lastSupersetId = exercise.supersetId;
                    }

                    return (
                        <div key={exerciseIndex} className={`exercise-section ${exercise.supersetId ? 'superset-exercise' : ''}`}>
                            {supersetHeading}
                            <div className="exercise-selector">
                                <input
                                    type="text"
                                    placeholder="Type to search exercises..."
                                    value={exercise.inputValue || ''}
                                    onChange={(e) => {
                                        handleExerciseInputChange(exerciseIndex, e.target.value);
                                        setIsDropdownVisible({ ...isDropdownVisible, [exerciseIndex]: true });
                                    }}
                                    onBlur={() => {
                                        // Optionally delay the hiding to allow for selection
                                        setTimeout(() => setIsDropdownVisible({ ...isDropdownVisible, [exerciseIndex]: false }), 300);
                                    }}
                                />
                                {/* Suggestions dropdown */}
                                {isDropdownVisible[exerciseIndex] && exercise.inputValue && (
                                    <ul className="exercise-suggestions">
                                        {filterExercises(exercise.inputValue).map(ex => (
                                            <li key={ex.ExerciseID} onClick={() => handleExerciseSelect(exerciseIndex, ex)}>
                                                {ex.Name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <button className="track-workout-button" type="button" onClick={() => removeExercise(exerciseIndex)}>Remove Exercise</button>
                            <button className="track-workout-button" type="button" onClick={() => toggleSlideOver(exercise.id)}>
                                View Exercise History
                            </button>
                            {exercise.sets.map((set, setIndex) => (
                                <div key={setIndex} className="set-section">
                                    <input
                                        className="set-input"
                                        type="number"
                                        placeholder="Reps"
                                        value={set.reps || ''}
                                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                                    />
                                    <input
                                        className="set-input"
                                        type="number"
                                        placeholder="Weight"
                                        value={set.weight || ''}
                                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                                    />
                                    <button className="track-workout-button" type="button" onClick={() => removeSet(exerciseIndex, setIndex)}>Remove Set</button>
                                </div>
                            ))}
                            <button className="track-workout-button" type="button" onClick={() => addSet(exerciseIndex)}>Add Set</button>
                            <button className="track-workout-button" type="button" onClick={() => moveExerciseUp(exerciseIndex)}>Move Up</button>
                            <button className="track-workout-button" type="button" onClick={() => moveExerciseDown(exerciseIndex)}>Move Down</button>
                        </div>
                    );
                })}
                <button className="track-workout-button" type="button" onClick={addExercise}>Add Exercise</button>
                <button className="track-workout-button" type="button" onClick={handleAddNewExercise}>Create New Exercise</button>
                <button className="track-workout-button" type="button" onClick={handleCreateSuperset}>Create Superset</button>
                <div className="track-workout-sticky-buttons">
                    <button className="save-workout-button" type="submit">Save Workout</button>
                    <button className="delete-workout-button" type="button" onClick={handleDeleteWorkout}>Delete Workout</button>

                </div>
            </div>

            {isSlideOverOpen && (
                <div className="slide-over-container open">
                    <h3>Exercise History</h3>
                    {Object.keys(groupedHistory).map(date => (
                        <div key={date}>
                            <h4>{date}</h4>
                            <ul>
                                {groupedHistory[date].map((item, index) => (
                                    <li key={index}>
                                        <strong>Set {item.SetNumber}:</strong> {item.Reps} reps at {item.Weight} lbs
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <button className="track-workout-button" onClick={toggleSlideOver}>Close</button>
                </div>
            )}
        </form>

    );

};


export default TrackWorkoutSession;