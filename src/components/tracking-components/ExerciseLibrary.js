import React, { useEffect, useState } from 'react';
import { fetchExercises } from '../../api/apiHandlers';

const ExerciseLibrary = () => {
    const [exercises, setExercises] = useState([]);

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
    }, []);

    return (
        <div>
            <h1>Exercise Library</h1>
            <ul>
                {exercises.map((exercise) => (
                    <li key={exercise.id}>
                        <h2>{exercise.Name}</h2>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExerciseLibrary;
