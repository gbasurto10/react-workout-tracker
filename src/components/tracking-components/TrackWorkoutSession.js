// TrackWorkoutSession.js
import React, { useState } from 'react';

const defaultExercise = {
  name: '',
  type: '',
  sets: [{ reps: '', weight: '' }],
};

const TrackWorkoutSession = () => {
  const [exercises, setExercises] = useState([defaultExercise]);

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    const sets = newExercises[exerciseIndex].sets.map((set, i) =>
      i === setIndex ? { ...set, [field]: value } : set
    );
    newExercises[exerciseIndex].sets = sets;
    setExercises(newExercises);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit exercises to the backend
    console.log('Submitting exercises:', exercises);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Track Workout Session</h2>
      {exercises.map((exercise, exerciseIndex) => (
        <div key={exerciseIndex}>
          <input
            type="text"
            placeholder="Exercise Name"
            value={exercise.name}
            onChange={(e) => handleExerciseChange(exerciseIndex, 'name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Type"
            value={exercise.type}
            onChange={(e) => handleExerciseChange(exerciseIndex, 'type', e.target.value)}
          />
          <button type="button" onClick={() => removeExercise(exerciseIndex)}>
            Remove Exercise
          </button>
          {exercise.sets.map((set, setIndex) => (
            <div key={setIndex}>
              <input
                type="number"
                placeholder="Reps"
                value={set.reps}
                onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
              />
              <input
                type="number"
                placeholder="Weight"
                value={set.weight}
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
      <button type="button" onClick={addExercise}>
        Add Exercise
      </button>
      <button type="submit">Save Workout</button>
    </form>
  );
};

export default TrackWorkoutSession;
