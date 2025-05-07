import { useState } from "react";
import "../styles/MonthlyReport.css";

export default function MonthlyExpenseCarousel({ expenses, onDeleteExpense }) {
    const [selectedDate, setSelectedDate] = useState(() => {
        const now = new Date();
        now.setDate(1);
        return now;
    });

    function formatMonth(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    function getMonthName(date) {
        return date.toLocaleString("default", { month: "long", year: "numeric" });
    }

    function changeMonth(offset) {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setSelectedDate(newDate);
    }

    function formatDay(dateStr) {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    }

    const selectedMonthStr = formatMonth(selectedDate);
    const filteredExpenses = expenses.filter((exp) =>
        exp.date.startsWith(selectedMonthStr)
    );

    // group by date
    const expensesByDate = filteredExpenses.reduce((acc, exp) => {
        if (!acc[exp.date]) {
            acc[exp.date] = [];
        }
        acc[exp.date].push(exp);
        return acc;
    }, {});

    // sort dates in descending order
    const sortedDates = Object.keys(expensesByDate).sort().reverse();

    const monthlyTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <div className="monthly-carousel">
            <h2>
                <button onClick={() => changeMonth(-1)}>◀</button>{" "}
                {getMonthName(selectedDate)}{" "}
                <button onClick={() => changeMonth(1)}>▶</button>

            </h2>
            <p className="month-total">Month's Total: <strong>€{monthlyTotal.toFixed(2)}</strong></p>

            {sortedDates.length === 0 ? (
                <p className="no-expenses-message">No expenses for this month.</p>
            ) : (
                sortedDates.map((date) => {
                    const dailyExpenses = expensesByDate[date];
                    const dailyTotal = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

                    return (
                        <div key={date} className="day-group">
                            <h3 className="day-title">
                                {formatDay(date)} — <span className="daily-total">€{dailyTotal.toFixed(2)}</span>
                            </h3>
                            <ul>
                                {dailyExpenses.map((exp) => (
                                    <li key={exp.id}>
                                        {exp.name} — €{exp.amount.toFixed(2)} [{exp.category}]
                                        <button className="delete-btn" onClick={() => onDeleteExpense(exp.id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })
            )}
        </div>
    );

}
