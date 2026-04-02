const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Income', 'Expense'],
    default: 'Expense',
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food',
      'Transport',
      'Education',
      'Health',
      'Shopping',
      'Utilities',
      'Entertainment',
      'Other',
    ],
  },
  description: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
