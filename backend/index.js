const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rak@1411',
  database: 'TASKDB' // Ensure this matches your database name
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the MySQL database.');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/tasks', (req, res) => {
  const { title, description, user_id } = req.body;
  const query = 'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)';

  connection.query(query, [title, description, user_id], (err, results) => {
    if (err) {
      console.error('Error creating task:', err);
      res.status(500).json({ error: 'Error creating task' });
    } else {
      res.status(201).json({ id: results.insertId, title, description, user_id });
    }
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, user_id } = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ?, user_id = ? WHERE id = ?';

  connection.query(query, [title, description, user_id, id], (err, results) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ error: 'Error updating task' });
    } else {
      res.status(200).json({ id, title, description, user_id });
    }
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).json({ error: 'Error deleting task' });
    } else {
      res.status(200).json({ message: 'Task deleted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
