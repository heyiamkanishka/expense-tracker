import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Trash2,
  Wallet,
  TrendingUp,
  MoreHorizontal,
  Coffee,
  Bus,
  Book,
  HeartPulse,
  ShoppingBag,
  Zap,
  Edit2,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './index.css';

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

const CHART_COLORS = ['#ff0000', '#cc0000', '#990000', '#444444', '#777777', '#bbbbbb', '#111111', '#555555'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('Transactions');
  const [theme, setTheme] = useState('light');
  
  // Budgeting state saved in local storage
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('app_budgets');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [budgetForm, setBudgetForm] = useState({ category: 'Food', limit: '' });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Expense',
    amount: '',
    category: 'Food',
    description: ''
  });

  useEffect(() => {
    fetchExpenses();
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('app_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, amount: Math.round(parseFloat(formData.amount) * 100) / 100 };
      if (editingId) {
        await axios.put(`/api/expenses/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post('/api/expenses', payload);
      }
      fetchExpenses();
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'Expense',
        amount: '',
        category: 'Food',
        description: ''
      });
      setActiveTab('Transactions');
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setFormData({
      date: new Date(exp.date).toISOString().split('T')[0],
      type: exp.type,
      amount: exp.amount,
      category: exp.category,
      description: exp.description || ''
    });
    setActiveTab('Transactions');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'Expense',
      amount: '',
      category: 'Food',
      description: ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!budgetForm.limit || isNaN(budgetForm.limit)) return;
    setBudgets({ ...budgets, [budgetForm.category]: Math.round(parseFloat(budgetForm.limit) * 100) / 100 });
    setBudgetForm({ ...budgetForm, limit: '' });
  };

  const handleDeleteBudget = (cat) => {
    const newBudgets = { ...budgets };
    delete newBudgets[cat];
    setBudgets(newBudgets);
  };

  const calculateTotal = (type) => {
    return expenses
      .filter((e) => e.type === type)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const income = calculateTotal('Income');
  const expense = calculateTotal('Expense');
  const balance = income - expense;

  // Prepare data for summary Pie Chart
  const expenseByCategory = {};
  expenses.filter(e => e.type === 'Expense').forEach(e => {
    expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
  });
  const pieData = Object.keys(expenseByCategory).map((key) => ({
    name: key,
    value: expenseByCategory[key]
  }));

  return (
    <div className="app-wrapper">
      <h1 className="header-title">
        <Wallet size={32} /> What is my money doing?
      </h1>
      
      <div className="navbar">
        <div className="nav-tabs">
          <button className={`nav-btn ${activeTab === 'Transactions' ? 'active' : ''}`} onClick={() => setActiveTab('Transactions')}>Transactions</button>
          <button className={`nav-btn ${activeTab === 'Summary' ? 'active' : ''}`} onClick={() => setActiveTab('Summary')}>Summary</button>
          <button className={`nav-btn ${activeTab === 'Budgeting' ? 'active' : ''}`} onClick={() => setActiveTab('Budgeting')}>Budgeting</button>
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>

      {activeTab === 'Transactions' && (
        <div className="app-container">
          {/* Left side: Form & Stats */}
          <div className="left-panel">
            <div className="stats-container">
              <div className="stat-card">
                <span className="stat-title">Balance</span>
                <span className="stat-value" style={{ color: balance >= 0 ? 'var(--income-color)' : 'var(--expense-color)' }}>
                  LKR {balance.toFixed(2)}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-title">Income</span>
                <span className="stat-value amount-income">
                  LKR {income.toFixed(2)}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-title">Expense</span>
                <span className="stat-value amount-expense">
                  LKR {expense.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="glass-card">
              <h3>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
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
                  <label>Amount (LKR)</label>
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

                {editingId ? (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      <Edit2 size={20} /> Update
                    </button>
                    <button type="button" className="btn" style={{ flex: 1, backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--card-border)' }} onClick={handleCancelEdit}>
                      <X size={20} /> Cancel
                    </button>
                  </div>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    <Plus size={20} /> Add Transaction
                  </button>
                )}
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
                        {exp.type === 'Income' ? <TrendingUp size={20} color="var(--income-color)" /> : categoryIcons[exp.category] || <MoreHorizontal size={20} />}
                      </div>
                      <div className="expense-details">
                        <h4>{exp.description || exp.category}</h4>
                        <p>
                          {new Date(exp.date).toLocaleDateString()} at {new Date(exp.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {exp.category}
                        </p>
                      </div>
                    </div>
                    <div className="expense-item-right">
                      <span className={`expense-amount ${exp.type === 'Income' ? 'amount-income' : 'amount-expense'}`}>
                        {exp.type === 'Income' ? '+' : '-'}LKR {exp.amount.toFixed(2)}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(exp)}
                          className="btn-icon"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(exp._id)}
                          className="btn-icon"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Summary' && (
        <div className="glass-card">
          <h2>Expenses Summary</h2>
          {pieData.length === 0 ? (
             <p className="empty-state">No expense data available to visualize.</p>
          ) : (
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `LKR ${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Budgeting' && (
        <div className="glass-card">
          <h2>Budgeting Limits</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Set monthly budget limits. See your usage fill up instantly!</p>
          
          <form className="budget-add-card" onSubmit={handleAddBudget}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Category</label>
              <select
                className="form-control"
                value={budgetForm.category}
                onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value})}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Limit (LKR)</label>
              <input
                type="number"
                min="1"
                required
                className="form-control"
                value={budgetForm.limit}
                onChange={(e) => setBudgetForm({...budgetForm, limit: e.target.value})}
                placeholder="e.g. 500"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Save Budget</button>
          </form>

          <div>
            {Object.keys(budgets).length === 0 ? (
               <p className="empty-state" style={{ padding: '1rem' }}>No budgets set yet.</p>
            ) : (
              Object.keys(budgets).map(cat => {
                const limit = budgets[cat];
                const spent = expenseByCategory[cat] || 0;
                const percent = Math.min((spent / limit) * 100, 100);
                const isExceeding = spent > limit;

                return (
                  <div key={cat} className="budget-item">
                    <div className="budget-header">
                      <span className="budget-name">{cat}</span>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span className="budget-amounts">
                          LKR {spent.toFixed(2)} / LKR {limit.toFixed(2)}
                        </span>
                        <button className="btn-icon" onClick={() => handleDeleteBudget(cat)} title="Remove budget"><X size={16}/></button>
                      </div>
                    </div>
                    <div className="tube-container">
                      <div 
                        className={`tube-fill ${isExceeding ? 'red' : 'blue'}`} 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    {isExceeding && <small style={{ color: 'var(--tube-red-bg)', marginTop: '0.25rem', display: 'block' }}>Exceeded limit by LKR {(spent - limit).toFixed(2)}!</small>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;