import { useState, useEffect } from "react";
import Tabs from "./components/Tabs";
import ExpenseForm from "./components/ExpenseForm.jsx";
import MonthlyReport from "./components/MonthlyReport.jsx";
import "./App.css";


export default function App() {
  const [expenses, setExpenses] = useState(() => {

    // Retrieve saved data from localStorage 
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage every time expenses change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [...prev, newExpense]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const tabs = [
    {
      label: "Add Expense",
      content:
        <ExpenseForm
          onAddExpense={handleAddExpense}
          onDeleteExpense={handleDeleteExpense}
          expenses={expenses}
        />
    },
    {
      label: "Monthly View",
      content: <MonthlyReport expenses={expenses} onDeleteExpense={handleDeleteExpense} />
    }
  ];

  return (
    <div >
      <div className="app-container">
        <h1 className="page-header">Expense Tracker</h1>
        <Tabs tabs={tabs} />
      </div >
    </div>
  );
}
