import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Trash2,
  Wallet,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Bus,
  Book,
  HeartPulse,
  Zap,
  MoreHorizontal,
  Coffee
} from 'lucide-react';
import './index.css';

//const API_URL = 'http://localhost:5001/api/expenses';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const CATEGORIES = [
  'Food',
  'Transport',
  'Education',
  'Health',
  'Shopping',
  'Utilities',
  'Entertainment',
  'Other',
];

const categoryIcons = {
  Food: <Coffee size={20} />,
  Transport: <Bus size={20} />,
  Education: <Book size={20} />,
  Health: <HeartPulse size={20} />,
  Shopping: <ShoppingBag size={20} />,
  Utilities: <Zap size={20} />,
  Other: <MoreHorizontal size={20} />,
  Entertainment: <Zap size={20} />
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Expense',
    amount: '',
    category: 'Food',
    description: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/expenses`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/expenses`, formData);
      fetchExpenses();
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'Expense',
        amount: '',
        category: 'Food',
        description: ''
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const calculateTotal = (type) => {
    return expenses
      .filter((e) => e.type === type)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const income = calculateTotal('Income');
  const expense = calculateTotal('Expense');
  const balance = income - expense;

  return (
    <div className="app-container">
      {/* Left side: Form & Stats */}
      <div className="left-panel">
        <h1 className="header-title">
          <Wallet size={32} color="#3b82f6" /> Expense Manager
        </h1>

        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-title">Balance</span>
            <span className="stat-value" style={{ color: balance >= 0 ? 'var(--income-color)' : 'var(--expense-color)' }}>
              ${balance.toFixed(2)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-title">Income</span>
            <span className="stat-value amount-income">
              ${income.toFixed(2)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-title">Expense</span>
            <span className="stat-value amount-expense">
              ${expense.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="glass-card">
          <h3>Add Transaction</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>

            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="form-control"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Coffee, Groceries, etc."
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Plus size={20} /> Add Transaction
            </button>
          </form>
        </div>
      </div>

      {/* Right side: List */}
      <div className="right-panel">
        <h2 style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>History</h2>

        {expenses.length === 0 ? (
          <div className="glass-card empty-state">
            <Wallet size={48} opacity={0.5} />
            <p>No transactions found. Add one to get started!</p>
          </div>
        ) : (
          <div className="expense-list">
            {expenses.map((exp) => (
              <div key={exp._id} className="expense-item">
                <div className="expense-item-left">
                  <div className="expense-icon">
                    {exp.type === 'Income' ? <TrendingUp size={20} color="#10b981" /> : categoryIcons[exp.category] || <MoreHorizontal size={20} />}
                  </div>
                  <div className="expense-details">
                    <h4>{exp.description || exp.category}</h4>
                    <p>{new Date(exp.date).toLocaleDateString()} • {exp.category}</p>
                  </div>
                </div>
                <div className="expense-item-right">
                  <span className={`expense-amount ${exp.type === 'Income' ? 'amount-income' : 'amount-expense'}`}>
                    {exp.type === 'Income' ? '+' : '-'}${exp.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="btn-icon"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
