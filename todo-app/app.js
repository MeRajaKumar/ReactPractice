const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection (replace 'your_mongodb_url' with your MongoDB URL)
mongoose.connect('mongodb://localhost:27017/todoApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Define a schema for tasks
const taskSchema = new mongoose.Schema({
  name: String,
  completed: { type: Boolean, default: false }
});

// Create a model based on the schema
const Task = mongoose.model('Task', taskSchema);

// Serve static files like CSS, JS
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('index', { tasks });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new task
app.post('/add', async (req, res) => {
  const newTask = new Task({ name: req.body.name });
  try {
    await newTask.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Mark a task as completed
app.post('/complete/:id', async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { completed: true });
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a task
app.post('/delete/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
