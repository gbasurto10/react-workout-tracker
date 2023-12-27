import React, { useEffect, useState } from 'react';
import { fetchExercises, updateExercise } from '../../api/apiHandlers';
import '../../styles/styles.css';

const ExerciseLibrary = () => {
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [editableExercise, setEditableExercise] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const getExercises = async () => {
            try {
                const fetchedExercises = await fetchExercises();
                const sortedExercises = fetchedExercises.sort((a, b) => {
                    const nameA = a.Name.toLowerCase();
                    const nameB = b.Name.toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                setExercises(sortedExercises);
            } catch (error) {
                console.error("Failed to fetch exercises:", error);
            }
        };

        getExercises();
        console.log("Exercises: ", exercises);
    }, []);

    const handleExerciseClick = (exercise) => {
        setSelectedExercise(exercise);
        setEditableExercise({ ...exercise }); // Copy the selected exercise to the editable state
        setIsEditMode(false); // Reset to view mode whenever a new exercise is clicked
    };

    const closeModal = () => {
        setSelectedExercise(null);
        setIsEditMode(false);
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
    
        // Handle checkboxes separately to convert boolean checked state to 1 or 0
        if (type === "checkbox") {
            setEditableExercise({ ...editableExercise, [name]: checked });
        } else {
            setEditableExercise({ ...editableExercise, [name]: value });
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Construct the exercise data to match the database schema
            const exerciseToUpdate = {
                Name: editableExercise.Name,
                Type: editableExercise.Type,
                Description: editableExercise.Description || null, // Use null for an empty description
                TracksTime: editableExercise.TracksTime ? 1 : 0, // Convert boolean to 1 or 0
                TracksDistance: editableExercise.TracksDistance ? 1 : 0,
                TracksReps: editableExercise.TracksReps ? 1 : 0,
                TracksWeight: editableExercise.TracksWeight ? 1 : 0,
            };
            await updateExercise(selectedExercise.ExerciseID, exerciseToUpdate);
    
            // Now update the exercises in the state with the new details
            setExercises(exercises.map(ex => ex.ExerciseID === selectedExercise.ExerciseID ? { ...ex, ...exerciseToUpdate } : ex));
            setIsEditMode(false); // Exit edit mode on successful update
        } catch (error) {
            console.error("Failed to update exercise:", error);
        }
    };
    


    return (
        <div>
            <h1>Exercise Library</h1>
            <ul>
                {exercises.map((exercise) => (
                    <li key={exercise.ExerciseID} onClick={() => handleExerciseClick(exercise)}>
                        <h2>{exercise.Name}</h2>
                    </li>
                ))}
            </ul>
            {selectedExercise && (
                <div className="modal">
                    <div className="modal-content" style={{ position: 'relative' }}>
                        <button className="modal-close-btn" onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px' }}>×</button>
                        {isEditMode ? (
                            <form className="modal-form" onSubmit={handleSubmit}>
                                <div>
                                    {/* Edit Name */}
                                    <label htmlFor="name">Name:</label>
                                    <input type="text" id="name" name="Name" value={editableExercise.Name} onChange={handleInputChange} />
                                </div>
                                <div>
                                    {/* Edit Type */}
                                    <label htmlFor="type">Type:</label>
                                    <input type="text" id="type" name="Type" value={editableExercise.Type} onChange={handleInputChange} />
                                </div>
                                <div>
                                    {/* Edit Description */}
                                    <label htmlFor="description">Description:</label>
                                    <textarea id="description" name="Description" value={editableExercise.Description} onChange={handleInputChange} />
                                </div>
                                <div>
                                    {/* Edit TracksTime */}
                                    <label>
                                        <input type="checkbox" id="tracksTime" name="TracksTime" checked={editableExercise.TracksTime} onChange={handleInputChange}
                                        /> Track Time
                                    </label>
                                </div>
                                <div>
                                    {/* Edit TracksDistance */}
                                    <label>
                                        <input type="checkbox" id="tracksDistance" name="TracksDistance" checked={editableExercise.TracksDistance} onChange={handleInputChange}
                                        /> Track Distance
                                    </label>
                                </div>
                                <div>
                                    {/* Edit TracksWeight */}
                                    <label>
                                    <input type="checkbox" id="tracksWeight" name="TracksWeight" checked={editableExercise.TracksWeight} onChange={handleInputChange}
                                    /> Track Weight
                                    </label>
                                </div>
                                <div>
                                    {/* Edit TracksReps */}
                                    <label>
                                    <input type="checkbox" id="tracksReps" name="TracksReps" checked={editableExercise.TracksReps} onChange={handleInputChange}
                                    /> Track Reps
                                    </label>
                                </div>
                                <button className="button" type="submit" onClick={handleSubmit}>Update Exercise</button>
                            </form>
                        ) : (
                            <>
                                <h2>{selectedExercise.Name}</h2>
                                <p>Type: {selectedExercise.Type}</p>
                                <button onClick={handleEditClick}>Edit</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseLibrary;