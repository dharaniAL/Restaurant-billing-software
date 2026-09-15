import { useEffect, useState } from "react";

function Tables({ goBack, currentUser }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // FETCH TABLES FROM BACKEND
  // ===============================
  const fetchTables = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://restaurant-billing-backend-jqh6.onrender.com/api/tables"
      );

      const data = await response.json();

      if (data.success) {
        setTables(data.tables || []);
      } else {
        setError(data.message || "Failed to load tables.");
      }
    } catch (err) {
      console.error("Tables fetch error:", err);
      setError("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD TABLES WHEN PAGE OPENS
  // ===============================
  useEffect(() => {
    fetchTables();
  }, []);

  // ===============================
  // MARK TABLE AVAILABLE
  // ===============================
  const markAvailable = async (tableId) => {
    if (!currentUser?.id) {
      alert("User information is missing. Please login again.");
      return;
    }

    try {
      const response = await fetch(
        `https://restaurant-billing-backend-jqh6.onrender.com/api/tables/${tableId}/settle`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentUser.id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Table marked as available.");
        fetchTables();
      } else {
        alert(data.message || "Failed to update table.");
      }
    } catch (err) {
      console.error("Table update error:", err);
      alert("Cannot connect to backend.");
    }
  };
  // ===============================
// RESERVE / OPEN TABLE
// ===============================
const reserveTable = async (tableId) => {
  if (!currentUser?.id) {
    alert("User information is missing. Please login again.");
    return;
  }

  try {
    const response = await fetch(
      `https://restaurant-billing-backend-jqh6.onrender.com/api/tables/${tableId}/reserve`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.id,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Table reserved successfully.");
      fetchTables();
    } else {
      alert(data.message || "Failed to reserve table.");
    }
  } catch (err) {
    console.error("Table reservation error:", err);
    alert("Cannot connect to backend.");
  }
};

  // ===============================
  // SUMMARY
  // ===============================
  const available = tables.filter(
    (table) => table.status === "Available"
  ).length;

  const occupied = tables.filter(
    (table) => table.status === "Occupied"
  ).length;

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="tables-page">
        <div className="tables-header">
          <div>
            <p className="tables-label">TABLE MANAGEMENT</p>
            <h1>Restaurant Tables</h1>
            <p className="tables-subtitle">
              Check table availability and manage dine-in seating.
            </p>
          </div>

          <button
            className="tables-back-button"
            onClick={goBack}
          >
            ← Dashboard
          </button>
        </div>

        <div style={{ padding: "40px", textAlign: "center" }}>
          Loading tables...
        </div>
      </div>
    );
  }

  // ===============================
  // ERROR
  // ===============================
  if (error) {
    return (
      <div className="tables-page">
        <div className="tables-header">
          <div>
            <p className="tables-label">TABLE MANAGEMENT</p>
            <h1>Restaurant Tables</h1>
            <p className="tables-subtitle">
              Check table availability and manage dine-in seating.
            </p>
          </div>

          <button
            className="tables-back-button"
            onClick={goBack}
          >
            ← Dashboard
          </button>
        </div>

        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          <p>{error}</p>

          <button
            className="table-action occupy"
            onClick={fetchTables}
            style={{ maxWidth: "180px" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ===============================
  // MAIN UI
  // ===============================
  return (
    <div className="tables-page">

      {/* HEADER */}
      <div className="tables-header">
        <div>
          <p className="tables-label">
            TABLE MANAGEMENT
          </p>

          <h1>
            Restaurant Tables
          </h1>

          <p className="tables-subtitle">
            Check table availability and manage dine-in seating.
          </p>
        </div>

        <button
          className="tables-back-button"
          onClick={goBack}
        >
          ← Dashboard
        </button>
      </div>

      {/* SUMMARY */}
      <div className="table-summary">

        <div className="table-summary-card">
          <span>Total Tables</span>
          <strong>{tables.length}</strong>
        </div>

        <div className="table-summary-card">
          <span>Available</span>
          <strong>{available}</strong>
        </div>

        <div className="table-summary-card">
          <span>Occupied</span>
          <strong>{occupied}</strong>
        </div>

      </div>

      {/* TABLE GRID */}
      <div className="tables-grid">

        {tables.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
            }}
          >
            No tables found.
          </div>
        ) : (
          tables.map((table) => (

            <div
              className={
                table.status === "Occupied"
                  ? "table-card occupied"
                  : "table-card"
              }
              key={table.id}
            >

              {/* TOP */}
              <div className="table-top">

                <div className="table-number">
                  {table.table_number}
                </div>

                <span
                  className={
                    table.status === "Available"
                      ? "table-status available"
                      : "table-status occupied"
                  }
                >
                  {table.status}
                </span>

              </div>

              {/* INFO */}
              <div className="table-info">

                <p>
                  Seats
                  <strong>
                    {table.seats || 0}
                  </strong>
                </p>

                <p>
                  Current Bill
                  <strong>
                    ₹{Number(table.current_bill || 0).toFixed(2)}
                  </strong>
                </p>

              </div>

              {/* ITEMS */}
              {table.items && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    marginBottom: "12px",
                    lineHeight: "1.5",
                  }}
                >
                  {table.items}
                </div>
              )}

              {/* ACTION */}
              {table.status === "Occupied" ? (
                <button
                  className="table-action release"
                  onClick={() =>
                    markAvailable(table.id)
                  }
                >
                  Mark Available
                </button>
              ) : (
                <button
  className="table-action occupy"
  onClick={() => reserveTable(table.id)}
>
  Reserve Table
</button>
              )}

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default Tables;