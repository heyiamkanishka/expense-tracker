const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Expense = require('./models/Expense');

const app = express();

app.use(cors());
app.use(express.json());

// Check if running on local test db
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expense_manager';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
// Get all expenses (latest on top)
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 }); // Sort by date descending
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching expenses' });
  }
});

// Create new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { date, type, amount, category, description } = req.body;
    const newExpense = new Expense({ date, type, amount, category, description });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ error: 'Error creating expense', details: err.message });
  }
});

// Update expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedExpense) return res.status(404).json({ error: 'Expense not found' });
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ error: 'Error updating expense', details: err.message });
  }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting expense' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
