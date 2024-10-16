import React, { useState, useEffect } from 'react';
import '../../styles/index.css'; 
import { getTodos, updateTodos, deleteTodos } from '../services/todoService';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Function to create a user in case it doesn't exist
  const createUser = () => {
    return fetch('https://playground.4geeks.com/todo/user/hnkgarcia', {
      method: 'POST',
      body: JSON.stringify([]),  // Create an empty todo list for the user
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create user');
        }
        return response.json();
      })
      .then(data => {
        console.log('User created successfully:', data);
      })
      .catch(error => console.error('Error creating user:', error));
  };

  // Function to fetch tasks from the API after user is created
  const fetchTasks = () => {
    getTodos()
      .then(fetchedTodos => {
        if (Array.isArray(fetchedTodos)) {
          setTodos(fetchedTodos);
        } else {
          setTodos([]); // Default to an empty array if the response is invalid
        }
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setTodos([]); // In case of error, set to an empty array to avoid map errors
      });
  };

  // Fetch tasks on component mount, and create the user if necessary
  useEffect(() => {
    // First attempt to fetch todos
    getTodos()
      .then(fetchedTodos => {
        if (fetchedTodos && Array.isArray(fetchedTodos)) {
          setTodos(fetchedTodos);
        } else {
          setTodos([]);
        }
      })
      .catch(error => {
        // If fetching fails (likely a 404), create the user and fetch the todos again
        if (error.message.includes('404')) {
          console.log('User not found. Creating user...');
          createUser().then(fetchTasks);  // Create user, then fetch tasks
        } else {
          console.error('Error fetching tasks:', error);
        }
      });
  }, []);

  // Sync tasks with server
  const syncTasks = (updatedTodos) => {
    updateTodos(updatedTodos)
      .then(data => console.log('Sync successful:', data))
      .catch(error => console.error('Error syncing tasks:', error));
  };

  // Add new task
  const addTask = () => {
    if (newTask.trim() === '') return;
    const updatedTodos = [...todos, { label: newTask, done: false }];
    setTodos(updatedTodos);
    setNewTask('');
    syncTasks(updatedTodos);
  };

  // Delete a task
  const deleteTask = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    syncTasks(updatedTodos);
  };

  // Clean all tasks
  const cleanAllTasks = () => {
    deleteTodos()
      .then(() => {
        setTodos([]);
        console.log('All tasks deleted successfully.');
      })
      .catch(error => console.error('Error deleting tasks:', error));
  };

  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') addTask(); }}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="todo-list">
        {Array.isArray(todos) && todos.length > 0 ? (
          todos.map((todo, index) => (
            <li key={index} className="todo-item">
              <span>{todo.label}</span>
              <button onClick={() => deleteTask(index)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </ul>
      {Array.isArray(todos) && todos.length > 0 && (
        <button className="clean-button" onClick={cleanAllTasks}>
          Clean All Tasks
        </button>
      )}
    </div>
  );
}

export default App;
