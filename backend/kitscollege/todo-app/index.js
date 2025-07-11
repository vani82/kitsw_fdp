const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const DB_FILE = './db.json';

// Helper to read database
function readDB() {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper to write database
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Get all todos
app.get('/todos', (req, res) => {
  const db = readDB();
  res.json(db.todos);
});

// Get a single todo
app.get('/todos/:id', (req, res) => {
  const db = readDB();
  const todo = db.todos.find(t => t.id == req.params.id);
  if (todo) res.json(todo);
  else res.status(404).json({ error: 'Todo not found' });
});

// Create a new todo
app.post('/todos', (req, res) => {
  const db = readDB();
  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    completed: false
  };
  db.todos.push(newTodo);
  writeDB(db);
  res.status(201).json(newTodo);
});

// Update a todo
app.put('/todos/:id', (req, res) => {
  const db = readDB();
  const todo = db.todos.find(t => t.id == req.params.id);
  if (todo) {
    todo.title = req.body.title ?? todo.title;
    todo.completed = req.body.completed ?? todo.completed;
    writeDB(db);
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const db = readDB();
  const newTodos = db.todos.filter(t => t.id != req.params.id);
  if (newTodos.length === db.todos.length) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  db.todos = newTodos;
  writeDB(db);
  res.json({ message: 'Todo deleted' });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
