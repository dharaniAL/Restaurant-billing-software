import { useEffect, useState } from "react";

function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/expenses");
      const data = await response.json();

      if (data.success) {
        setExpenses(data.expenses);
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!expenseName || !amount) {
      alert("Please enter expense name and amount");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expense_name: expenseName,
          amount: Number(amount),
          category: category,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Expense added successfully");

        setExpenseName("");
        setAmount("");
        setCategory("Food");

        fetchExpenses();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Cannot connect to backend");
    }
  };

  return (
    <div className="expenses-page">

      <h1>Expenses</h1>
      <p>Manage your restaurant expenses</p>

      {/* ADD EXPENSE */}
      <div className="expense-card">

        <h2>Add Expense</h2>

        <form onSubmit={handleAddExpense}>

          <div className="expense-form">

            <div>
              <label>Expense Name</label>

              <input
                type="text"
                placeholder="Example: Vegetables"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </div>

            <div>
              <label>Amount</label>

              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label>Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Salary</option>
                <option>Rent</option>
                <option>Electricity</option>
                <option>Gas</option>
                <option>Maintenance</option>
                <option>Other</option>
              </select>
            </div>

            <button type="submit">
              + Add Expense
            </button>

          </div>

        </form>

      </div>

      {/* EXPENSE LIST */}
      <div className="expense-card">

        <h2>Expense History</h2>

        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <div className="expense-table">

            <div className="expense-row expense-header">
              <span>Expense</span>
              <span>Category</span>
              <span>Amount</span>
              <span>Date</span>
            </div>

            {expenses.map((expense) => (
              <div className="expense-row" key={expense.id}>

                <span>{expense.expense_name}</span>

                <span>{expense.category}</span>

                <strong>
                  ₹{Number(expense.amount).toFixed(2)}
                </strong>

                <span>
                  {expense.expense_date
                    ? new Date(
                        expense.expense_date.replace(" ", "T") + "Z"
                      ).toLocaleDateString("en-IN")
                    : "-"}
                </span>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Expenses;