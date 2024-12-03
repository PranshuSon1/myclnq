const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const tasksFile = path.join(__dirname, '../data/tasks.json');

// Helper function to load tasks from file
function loadTasks() {
  const data = fs.readFileSync(tasksFile, 'utf8');
  return JSON.parse(data || '[]');
}

// Helper function to save tasks to file
function saveTasks(tasks) {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// Create a new task (Task 2)
router.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const tasks = loadTasks();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    description,
    status: 'pending',
  };

  tasks.push(newTask);
  saveTasks(tasks);

  res.status(201).json({
    message: 'Task created successfully',
    task: newTask,
  });
});

// Get all tasks (Task 3)
router.get('/', (req, res) => {
  const tasks = loadTasks();
  res.status(200).json(tasks);
});

// Update a task (Task 4)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const tasks = loadTasks();
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex].status = status;
  saveTasks(tasks);

  res.status(200).json({
    message: 'Task updated successfully',
    task: tasks[taskIndex],
  });
});

// Delete a task (Task 5)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  saveTasks(tasks);

  res.status(200).json({ message: 'Task deleted successfully' });
});

// Filter tasks by status (Task 6)
router.get('/status/:status', (req, res) => {
  const { status } = req.params;
  if (!['pending', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const tasks = loadTasks();
  const filteredTasks = tasks.filter((task) => task.status === status);
  res.status(200).json(filteredTasks);
});

module.exports = router;
