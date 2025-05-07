import { useState, useEffect } from "react";
import "../styles/ExpenseForm.css";

const categories = ["Food", "Transport", "Bills", "Entairtainment", "Other"];

const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
};

export default function ExpenseForm({ onAddExpense, onDeleteExpense, expenses }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(getTodayString());
    const [today, setToday] = useState(getTodayString());

    useEffect(() => {
        const interval = setInterval(() => {
            setToday(getTodayString());
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !amount || !category) {
            alert('Please fill in all the fields');
            return;
        }

        if (isNaN(amount) || Number(amount) <= 0) {
            alert('Amount must be a positive number');
            return;
        }

        const newExpense = {
            id: Date.now(),
            name,
            amount: parseFloat(amount),
            category,
            date
        };

        onAddExpense(newExpense);
        setName('');
        setAmount('');
        setCategory('');
        setDate(getTodayString());
    };

    const todayExpenses = expenses.filter(exp => exp.date === today);
    const totalToday = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <div>
            <form className="expense-form" onSubmit={handleSubmit}>
                <div>
                    <label>Name:{" "}
                        <input
                            type="text"
                            placeholder="e.g., Cinema tickets"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>Amount:{" "}
                        <input
                            type="number"
                            placeholder="e.g., 20.5"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>Category:{" "}
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>Date:{" "}
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>
                </div>
                <button type="submit">Add Expense</button>
            </form>

            <hr />

            <h3>Today's Expenses ({formatDisplayDate(today)})</h3>
            {todayExpenses.length === 0 ? (
                <p>No expenses for today.</p>
            ) : (
                <>
                    <ul className="expense-list">
                        {todayExpenses.map((exp) => (
                            <li key={exp.id} className="expense-item">
                                <span>
                                    {exp.name} – €{exp.amount.toFixed(2)} ({exp.category})
                                </span>
                                <button
                                    className="delete-button"
                                    onClick={() => onDeleteExpense(exp.id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                    <p className="daily-total-exp-form">
                        Today's Total:<strong> €{totalToday.toFixed(2)} </strong>
                    </p>
                </>
            )}
        </div>
    );
}
