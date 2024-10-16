const API_URL = 'https://playground.4geeks.com/todo/user/hnkgarcia';

// Fetch tasks from the API
export const getTodos = () => {
  return fetch(API_URL)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching tasks:', error);
      throw error;
    });
};

// Update tasks on the server
export const updateTodos = (todos) => {
  return fetch(API_URL, {
    method: 'PUT',
    body: JSON.stringify(todos),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(resp => resp.json())
    .catch(error => {
      console.error('Error updating tasks:', error);
      throw error;
    });
};

// Delete all tasks from the server
export const deleteTodos = () => {
  return fetch(API_URL, {
    method: 'DELETE'
  })
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Failed to delete tasks');
      }
    })
    .catch(error => {
      console.error('Error deleting tasks:', error);
      throw error;
    });
};
