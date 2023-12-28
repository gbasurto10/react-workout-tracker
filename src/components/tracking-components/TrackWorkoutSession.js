// TrackWorkoutSession.js
import React, { useState, useEffect } from 'react';
import {
    fetchExercises,
    createNewExercise,
    saveWorkoutSession,
    finishWorkoutSession,
    deleteWorkoutSession,
    fetchSessionExercises,
    fetchExerciseHistory,
    fetchActiveSessionDetails
} from '../../api/apiHandlers';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';


const defaultExercise = {
    name: '',
    type: '',
    sets: [{ reps: '', weight: '' }],
    inputValue: '',
    tracksTime: false,
    tracksDistance: false,
    tracksWeight: false,
    tracksReps: false
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
    const [isCreateExerciseModalOpen, setIsCreateExerciseModalOpen] = useState(false);
    

    const [newExerciseData, setNewExerciseData] = useState({
        name: '',
        type: '',
        description: '',
        trackTime: false,
        trackDistance: false,
        trackWeight: false,
        trackReps: false
    });



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


    // Fetch sesssion details when the component mounts
    useEffect(() => {
        const fetchActiveDetails = async () => {
            try {
                const details = await fetchActiveSessionDetails(sessionId);
                setSessionDetails(details);  // Store the active session details in state
                console.log("Session Details Fetched:", details);
            } catch (error) {
                console.error('Error fetching session details:', error);
                // You might want to handle this error, perhaps show an error message to the user
            }
        };

        if (sessionId) {
            fetchActiveDetails();
        }
    }, [sessionId]);


    // Fetch session exercises when the component mounts
    useEffect(() => {
        const loadSessionExercises = async () => {
            try {
                let sessionExercisesData = await fetchSessionExercises(sessionId);

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
                        setNumber: exercise.SetNumber,
                        time: exercise.Time,
                        distance: exercise.Distance
                    });
                });

                console.log('Session Data:', sessionExercisesData);

                // Flatten the supersets into a sorted array and process tracking flags
                let exercisesArray = [];
                Object.values(supersets).forEach(superset => {
                    Object.values(superset).forEach(exercise => {
                        // Initialize tracking flags
                        let tracksReps = false;
                        let tracksWeight = false;
                        let tracksTime = false;
                        let tracksDistance = false;

                        // Determine which metrics are being tracked
                        exercise.sets.forEach(set => {
                            if (set.reps != null) tracksReps = true;
                            if (set.weight != null) tracksWeight = true;
                            if (set.time != null) tracksTime = true;
                            if (set.distance != null) tracksDistance = true;
                        });

                        exercisesArray.push({
                            ...exercise,
                            sets: exercise.sets.sort((a, b) => a.setNumber - b.setNumber),
                            inputValue: exercise.name, // Set the inputValue to the exercise name
                            tracksDistance,
                            tracksReps,
                            tracksTime,
                            tracksWeight
                        });
                    });
                });

                // Sort by OrderID to maintain the overall order
                exercisesArray.sort((a, b) => a.order - b.order);

                console.log('Fetched exercises:', exercisesArray);
                setExercises(exercisesArray);
            } catch (err) {
                console.error('Error loading session exercises:', err);
            }
        };

        // Load from local storage if available, otherwise load from the API
        const savedSession = localStorage.getItem('workoutSession');
        if (savedSession) {
            const sessionData = JSON.parse(savedSession);

            // Update each exercise to include the inputValue field
            const updatedExercises = sessionData.exercises.map(exercise => ({
                ...exercise,
                inputValue: exercise.name || ''
            }));

            setExercises(updatedExercises);
        } else {
            loadSessionExercises();
        }
    }, [sessionId]);




    // Function to load exercises
    const loadExercises = async () => {
        const exercisesData = await fetchExercises();
        console.log('Exercises:', exercisesData);

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
            tracksDistance: !!selectedExercise.TracksDistance, // Use double NOT to convert to boolean if necessary
            tracksReps: !!selectedExercise.TracksReps,
            tracksTime: !!selectedExercise.TracksTime,
            tracksWeight: !!selectedExercise.TracksWeight,
            inputValue: selectedExercise.Name
        };
        setExercises(newExercises);
        setIsDropdownVisible({ ...isDropdownVisible, [index]: false }); // Hide the dropdown

        console.log('Selected exercise:', newExercises[index]);
    };



    const addExercise = () => {
        const newExercise = {
            ...defaultExercise,
            sets: [{ reps: '', weight: '', time: '', distance: '' }], // Include placeholders for all metrics
            order: exercises.length + 1 // Assign the next OrderID
        };

        setExercises([...exercises, newExercise]);
    };




    const addSet = (exerciseIndex) => {
        const newExercises = [...exercises];
        newExercises[exerciseIndex].sets.push({ reps: '', weight: '' });
        setExercises(newExercises);
    };

    const removeExercise = (index) => {
        const exerciseToRemove = exercises[index];

        const newExercises = exercises.filter((_, i) => i !== index);
        setExercises(newExercises);

        // Save updated state to local storage
        localStorage.setItem('workoutSession', JSON.stringify(newExercises));
    };



    const removeSet = (exerciseIndex, setIndex) => {
        const setToRemove = exercises[exerciseIndex].sets[setIndex];
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
                Weight: set.weight,
                Time: set.time || null,  // Include Time, allow null
                Distance: set.distance || null,  // Include Distance, allow null
            }))
        }));
    }






    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Your existing logic to save the workout session
            const preparedExercises = prepareExercisesForSave();
            console.log('Data being sent for saving:', { sessionId, preparedExercises }); // Add this line to log the data
            await saveWorkoutSession(sessionId, preparedExercises);

            // Mark the session as finished
            await finishWorkoutSession(sessionId);

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


    const toggleSlideOver = async (exerciseId) => {
        if (!isSlideOverOpen) {
            await loadExerciseHistory(exerciseId);
        }
        setIsSlideOverOpen(!isSlideOverOpen);
    };

    const handleCreateNewExercise = async (event) => {
        event.preventDefault();
        console.log('Creating new exercise with data:', newExerciseData);

        try {
            // Ensure newExerciseData is structured as required by your backend
            const exerciseDataToSend = {
                name: newExerciseData.name,
                type: newExerciseData.type,
                description: newExerciseData.description,
                tracksTime: newExerciseData.trackTime,
                tracksDistance: newExerciseData.trackDistance,
                tracksWeight: newExerciseData.trackWeight,
                tracksReps: newExerciseData.trackReps
            };

            console.log('Sending data to create new exercise:', exerciseDataToSend);

            await createNewExercise(exerciseDataToSend);

            toggleCreateExerciseModal();
            // Handle success - e.g., close the modal, clear form, refresh exercises list

            // Refresh the exercises list
            await loadExercises();
        } catch (error) {
            console.error('Error creating new exercise:', error);
            // Handle error in UI
        }
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

    // Toggle the Modal State
    const toggleCreateExerciseModal = () => {
        setIsCreateExerciseModalOpen(!isCreateExerciseModalOpen);
    };

    // Checkbox onChange handlers
    const handleCheckboxChange = (property, value) => {
        setNewExerciseData(prevData => ({
            ...prevData,
            [property]: value
        }));
    };


    // Dynamically Generate Input Fields for Exercises
    function renderExerciseInputs(exercise, exerciseIndex, setIndex) {
        return (
            <>
                {/* Render reps input if tracksReps is true */}
                {exercise.tracksReps && (
                    <input
                        type="number"
                        className="set-input"
                        value={exercise.sets[setIndex].reps}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                        placeholder="Reps"
                    />
                )}

                {/* Render weight input if tracksWeight is true */}
                {exercise.tracksWeight && (
                    <input
                        type="number"
                        className="set-input"
                        value={exercise.sets[setIndex].weight}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                        placeholder="Weight"
                    />
                )}

                {/* Render time input if tracksTime is true */}
                {exercise.tracksTime && (
                    <div>
                        <input
                            type="number"
                            className="set-input"
                            value={exercise.sets[setIndex].time}
                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'time', e.target.value)}
                            placeholder="Duration (seconds)"
                        />
                        <span>seconds</span>
                    </div>
                )}

                {/* Render distance input if tracksDistance is true */}
                {exercise.tracksDistance && (
                    <div>
                        <input
                            type="number"
                            className="set-input"
                            value={exercise.sets[setIndex].distance}
                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'distance', e.target.value)}
                            placeholder="Distance (meters)"
                        />
                        <span>meters</span>
                    </div>
                )}

            </>
        );
    }








    return (
        <form onSubmit={handleSubmit}>
            <div className="track-workout-container">
                <div className="main-workout-view">
                    <h2 className="header">Track Workout Session</h2>
                    <div className="session-details">
                        {sessionDetails ? (
                            <>
                                <p><strong>Date:</strong> {new Date(sessionDetails.Date).toLocaleDateString()}</p>
                                <p><strong>Description:</strong> {sessionDetails.Description}</p>
                            </>
                        ) : (
                            <p>Loading session details...</p>
                        )}
                    </div>
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
                                        className="exercise-search-input"
                                        onChange={(e) => {
                                            handleExerciseInputChange(exerciseIndex, e.target.value);
                                            setIsDropdownVisible({ ...isDropdownVisible, [exerciseIndex]: true });
                                        }}
                                        onFocus={() => setIsDropdownVisible({ ...isDropdownVisible, [exerciseIndex]: true })}
                                        onBlur={() => setTimeout(() => setIsDropdownVisible({ ...isDropdownVisible, [exerciseIndex]: false }), 300)}

                                    />
                                    {isDropdownVisible[exerciseIndex] && (
                                        <ul className="exercise-suggestions">
                                            {filterExercises(exercise.inputValue).map(ex => (
                                                <li
                                                    key={ex.ExerciseID}
                                                    onClick={() => {
                                                        handleExerciseSelect(exerciseIndex, ex);
                                                        setIsDropdownVisible({ ...isDropdownVisible, [exerciseIndex]: false });
                                                    }}>
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
                                        {renderExerciseInputs(exercise, exerciseIndex, setIndex)}
                                        <button className="track-workout-button" type="button" onClick={() => removeSet(exerciseIndex, setIndex)}>Remove Set</button>
                                    </div>
                                ))}
                                <button className="track-workout-mod-button" type="button" onClick={() => addSet(exerciseIndex)}>Add Set</button>
                                <button className="track-workout-mod-button" type="button" onClick={() => moveExerciseUp(exerciseIndex)}>Move Up</button>
                                <button className="track-workout-mod-button" type="button" onClick={() => moveExerciseDown(exerciseIndex)}>Move Down</button>
                            </div>
                        );
                    })}
                    <button className="track-workout-button" type="button" onClick={addExercise}>Add Exercise</button>
                    <button type="button" className="track-workout-button" onClick={toggleCreateExerciseModal}>Create New Exercise</button>
                    <button className="track-workout-button" type="button" onClick={handleCreateSuperset}>Create Superset</button>
                </div>
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

            {isCreateExerciseModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={toggleCreateExerciseModal}>×</button>
                        <form className="modal-form" onSubmit={handleCreateNewExercise}>
                            <input
                                type="text"
                                placeholder="Exercise Name"
                                onChange={(e) => setNewExerciseData({ ...newExerciseData, name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Exercise Type"
                                onChange={(e) => setNewExerciseData({ ...newExerciseData, type: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Notes"
                                onChange={(e) => setNewExerciseData({ ...newExerciseData, description: e.target.value })}
                            />
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleCheckboxChange('trackTime', e.target.checked)}
                                    /> Track Time
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleCheckboxChange('trackDistance', e.target.checked)}
                                    /> Track Distance
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleCheckboxChange('trackWeight', e.target.checked)}
                                    /> Track Weight
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleCheckboxChange('trackReps', e.target.checked)}
                                    /> Track Reps
                                </label>
                            </div>

                            <button type="submit" className="button" onClick={handleCreateNewExercise}>Create Exercise</button>
                            <button type="button" className="button" onClick={toggleCreateExerciseModal}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}




        </form>

    );

};


export default TrackWorkoutSession;