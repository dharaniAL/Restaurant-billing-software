import { useEffect, useState } from "react";

function Expenses({ goBack, currentUser }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    category: "Staff",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const categories = [
    "Staff",
    "Supplies",
    "Utilities",
    "Rent",
    "Maintenance",
    "Food & Ingredients",
    "Equipment",
    "Marketing",
    "Other",
  ];

  // ===============================
  // FETCH EXPENSES
  // ===============================

  const fetchExpenses = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/expenses"
      );

      const data = await response.json();

      console.log("Expenses received:", data);

      if (data.success) {
        const convertedExpenses =
          data.expenses.map((expense) => ({
            id: expense.expense_id,
            category: expense.category || "Other",
            description:
              expense.description || "",
            amount: Number(expense.amount) || 0,

            date: expense.date
              ? new Date(
                  expense.date.replace(
                    " ",
                    "T"
                  ) + "Z"
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "-",

            rawDate: expense.date,

            userId: expense.user_id,
          }));

        setExpenses(convertedExpenses);
      }
    } catch (error) {
      console.error(
        "Failed to fetch expenses:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ===============================
  // RESET FORM
  // ===============================

  const resetForm = () => {
    setFormData({
      category: "Staff",
      description: "",
      amount: "",
      date: new Date()
        .toISOString()
        .split("T")[0],
    });

    setEditingId(null);
  };

  // ===============================
  // ADD / UPDATE EXPENSE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.id) {
      alert("User information is missing.");
      return;
    }

    if (
      !formData.description.trim() ||
      !formData.amount
    ) {
      alert(
        "Please enter description and amount."
      );
      return;
    }

    const numericAmount = parseFloat(
      formData.amount
    );

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const endpoint = editingId
        ? `http://localhost:5000/api/expenses/${editingId}`
        : "http://localhost:5000/api/expenses";

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
  user_id: currentUser.id,
  category: formData.category,
  expense_name: formData.description.trim(),
  amount: numericAmount,
  date: formData.date,
}),
      });

      const data = await response.json();

      console.log("Expense response:", data);

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Failed to save expense."
        );
        return;
      }

      alert(
        editingId
          ? "Expense updated successfully!"
          : "Expense added successfully!"
      );

      resetForm();
      setShowForm(false);

      await fetchExpenses();
    } catch (error) {
      console.error(
        "Expense save error:",
        error
      );

      alert(
        "Cannot connect to backend."
      );
    }
  };

  // ===============================
  // DELETE EXPENSE
  // ===============================

  const handleDelete = async (id) => {
    if (!currentUser?.id) {
      alert("User information is missing.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/expenses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentUser.id,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Delete response:",
        data
      );

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Failed to delete expense."
        );
        return;
      }

      alert(
        "Expense deleted successfully!"
      );

      await fetchExpenses();
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        "Cannot connect to backend."
      );
    }
  };

  // ===============================
  // EDIT EXPENSE
  // ===============================

  const handleEdit = (expense) => {
    setFormData({
      category:
        expense.category || "Other",

      description:
        expense.description || "",

      amount:
        expense.amount.toString(),

      date:
        expense.rawDate
          ? expense.rawDate.split(" ")[0]
          : new Date()
              .toISOString()
              .split("T")[0],
    });

    setEditingId(expense.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // FILTER
  // ===============================

  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter(
          (expense) =>
            expense.category === filter
        );

  // ===============================
  // CALCULATIONS
  // ===============================

  const totalExpenses =
    filteredExpenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    );

  const allExpenses = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );

  const categoryTotals =
    categories.map((category) => ({
      category,

      total: expenses
        .filter(
          (expense) =>
            expense.category === category
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        ),
    }));

  // ===============================
  // RENDER
  // ===============================

  return (
    <div className="expenses-page">
      {/* HEADER */}

      <div className="expenses-header">
        <div>
          <p className="expenses-label">
            EXPENSE MANAGEMENT
          </p>

          <h1>Expenses</h1>

          <p className="expenses-subtitle">
            Track and manage all business
            expenses.
          </p>
        </div>

        <button
          className="expenses-back-button"
          onClick={goBack}
        >
          ← Dashboard
        </button>
      </div>

      {/* SUMMARY */}

      <section className="expenses-summary">
        <div className="expense-summary-card">
          <span>Total Expenses</span>

          <strong>
            ₹{allExpenses.toFixed(2)}
          </strong>

          <small>
            All expenses tracked
          </small>
        </div>

        <div className="expense-summary-card">
          <span>Categories</span>

          <strong>
            {categories.length}
          </strong>

          <small>
            Expense categories
          </small>
        </div>

        <div className="expense-summary-card">
          <span>Current Filter</span>

          <strong>
            ₹{totalExpenses.toFixed(2)}
          </strong>

          <small>
            {filter} expenses
          </small>
        </div>
      </section>

      {/* ADD BUTTON */}

      <div className="expenses-toolbar">
        <button
          className="add-expense-button"
          onClick={() => {
            if (showForm) {
              resetForm();
            }

            setShowForm(!showForm);
          }}
        >
          {showForm
            ? "✕ Cancel"
            : "+ Add Expense"}
        </button>
      </div>

      {/* FORM */}

      {showForm && (
        <div className="expense-form-card">
          <h3>
            {editingId
              ? "Edit Expense"
              : "Add New Expense"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="expense-form"
          >
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>

                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category:
                        e.target.value,
                    })
                  }
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Description</label>

                <input
                  type="text"
                  placeholder="e.g., Staff salary, Electric bill"
                  value={
                    formData.description
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Amount (₹)
                </label>

                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount:
                        e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
              >
                {editingId
                  ? "Update Expense"
                  : "Add Expense"}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CATEGORY BREAKDOWN */}

      <section className="expenses-breakdown">
        <div className="breakdown-header">
          <p>CATEGORY BREAKDOWN</p>

          <h2>
            Expense Distribution
          </h2>
        </div>

        <div className="category-breakdown-grid">
          {categoryTotals.map((cat) => (
            <div
              className={
                cat.total > 0
                  ? "category-card active"
                  : "category-card"
              }
              key={cat.category}
            >
              <div className="category-name">
                {cat.category}
              </div>

              <div className="category-amount">
                ₹{cat.total.toFixed(2)}
              </div>

              <div className="category-percent">
                {allExpenses > 0
                  ? (
                      (cat.total /
                        allExpenses) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FILTER */}

      <section className="expenses-filters">
        <div>
          <p>FILTER BY CATEGORY</p>

          <h2>Expenses List</h2>
        </div>

        <div className="filter-buttons">
          <button
            className={
              filter === "All"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() =>
              setFilter("All")
            }
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category}
              className={
                filter === category
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() =>
                setFilter(category)
              }
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* EXPENSE TABLE */}

      <section className="expenses-card">
        {loading ? (
          <div className="no-expenses">
            <h2>
              Loading expenses...
            </h2>

            <p>
              Getting expenses from
              the database.
            </p>
          </div>
        ) : (
          <div className="expenses-table">
            <div className="expenses-table-row expenses-table-header">
              <span>Date</span>
              <span>Category</span>
              <span>Description</span>
              <span>Amount</span>
              <span>Actions</span>
            </div>

            {filteredExpenses.length >
            0 ? (
              filteredExpenses.map(
                (expense) => (
                  <div
                    className="expenses-table-row"
                    key={expense.id}
                  >
                    <span className="expense-date">
                      {expense.date}
                    </span>

                    <span className="expense-category">
                      {expense.category}
                    </span>

                    <span className="expense-description">
                      {expense.description}
                    </span>

                    <strong className="expense-amount">
                      ₹
                      {Number(
                        expense.amount
                      ).toFixed(2)}
                    </strong>

                    <div className="expense-actions">
                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEdit(
                            expense
                          )
                        }
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(
                            expense.id
                          )
                        }
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="no-expenses">
                <h2>
                  No expenses found
                </h2>

                <p>
                  Add a new expense to
                  get started.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Expenses;