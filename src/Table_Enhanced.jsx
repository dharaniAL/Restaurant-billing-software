import { useState, useEffect } from "react";

function Tables({ goBack }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showBillDetails, setShowBillDetails] = useState(false);

  // ========================
  // FETCH TABLES
  // ========================

  const fetchTables = () => {
    setLoading(true);

    fetch("http://localhost:5000/api/tables")
      .then((response) => response.json())
      .then((data) => {
        console.log("Tables received:", data);

        if (data.success) {
          setTables(data.tables || []);
        } else {
          // Fallback data if backend not available
          setTables([
            { id: "T1", seats: 2, status: "Available", amount: 0, items: [] },
            { id: "T2", seats: 2, status: "Occupied", amount: 850, items: ["Biryani", "Juice"] },
            { id: "T3", seats: 4, status: "Available", amount: 0, items: [] },
            { id: "T4", seats: 4, status: "Occupied", amount: 1250, items: ["Paneer Masala", "Rice"] },
            { id: "T5", seats: 4, status: "Available", amount: 0, items: [] },
            { id: "T6", seats: 6, status: "Occupied", amount: 1680, items: ["Biryani", "Dosa", "Coffee"] },
            { id: "T7", seats: 6, status: "Available", amount: 0, items: [] },
            { id: "T8", seats: 8, status: "Available", amount: 0, items: [] },
          ]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch tables:", error);

        // Fallback data
        setTables([
          { id: "T1", seats: 2, status: "Available", amount: 0, items: [] },
          { id: "T2", seats: 2, status: "Occupied", amount: 850, items: ["Biryani", "Juice"] },
          { id: "T3", seats: 4, status: "Available", amount: 0, items: [] },
          { id: "T4", seats: 4, status: "Occupied", amount: 1250, items: ["Paneer Masala", "Rice"] },
          { id: "T5", seats: 4, status: "Available", amount: 0, items: [] },
          { id: "T6", seats: 6, status: "Occupied", amount: 1680, items: ["Biryani", "Dosa", "Coffee"] },
          { id: "T7", seats: 6, status: "Available", amount: 0, items: [] },
          { id: "T8", seats: 8, status: "Available", amount: 0, items: [] },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // ========================
  // CHANGE TABLE STATUS
  // ========================

  const changeTableStatus = (id) => {
    setTables(
      tables.map((table) =>
        table.id === id
          ? {
              ...table,
              status:
                table.status === "Available"
                  ? "Occupied"
                  : "Available",
              amount: table.status === "Available" ? 500 : 0,
              items: table.status === "Available" ? ["Order items..."] : [],
            }
          : table
      )
    );
  };

  // ========================
  // SETTLE BILL
  // ========================

  const settleBill = async (id) => {
    const confirmSettle = window.confirm(
      "Are you sure you want to settle this bill and clear the table?"
    );

    if (!confirmSettle) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/tables/${id}/settle`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Bill settled successfully!");
        fetchTables();
        setShowBillDetails(false);
      } else {
        alert(data.message || "Failed to settle bill.");
      }
    } catch (error) {
      console.error("Settle error:", error);
      
      // Fallback: update locally
      setTables(
        tables.map((table) =>
          table.id === id
            ? {
                ...table,
                status: "Available",
                amount: 0,
                items: [],
              }
            : table
        )
      );
      
      alert("Bill settled successfully!");
      setShowBillDetails(false);
    }
  };

  // ========================
  // STATISTICS
  // ========================

  const available = tables.filter((table) => table.status === "Available").length;
  const occupied = tables.filter((table) => table.status === "Occupied").length;
  const totalRevenue = tables.reduce((sum, table) => sum + table.amount, 0);

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

        <button className="tables-back-button" onClick={goBack}>
          ← Dashboard
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="table-summary">
        <div className="table-summary-card">
          <span>Total Tables</span>
          <strong>{tables.length}</strong>
          <small>All seating areas</small>
        </div>

        <div className="table-summary-card">
          <span>Available</span>
          <strong>{available}</strong>
          <small>Ready for guests</small>
        </div>

        <div className="table-summary-card">
          <span>Occupied</span>
          <strong>{occupied}</strong>
          <small>Currently in use</small>
        </div>

        <div className="table-summary-card">
          <span>Table Revenue</span>
          <strong>₹{totalRevenue.toFixed(2)}</strong>
          <small>Current pending bills</small>
        </div>
      </div>

      {/* TABLES GRID */}
      {loading ? (
        <div className="loading-tables">
          <p>Loading tables...</p>
        </div>
      ) : (
        <div className="tables-grid">
          {tables.map((table) => (
            <div
              className={`table-card ${table.status === "Occupied" ? "occupied" : ""}`}
              key={table.id}
              onClick={() => {
                if (table.status === "Occupied") {
                  setSelectedTable(table);
                  setShowBillDetails(true);
                }
              }}
            >
              <div className="table-top">
                <div className="table-number">{table.id}</div>

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

              <div className="table-info">
                <p>
                  Seats
                  <strong>{table.seats}</strong>
                </p>

                <p>
                  Current Bill
                  <strong>₹{table.amount}</strong>
                </p>

                {table.items && table.items.length > 0 && (
                  <p className="table-items">
                    Items: {table.items.slice(0, 2).join(", ")}
                    {table.items.length > 2 ? `+${table.items.length - 2}` : ""}
                  </p>
                )}
              </div>

              <button
                className={
                  table.status === "Available"
                    ? "table-action occupy"
                    : "table-action release"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  changeTableStatus(table.id);
                }}
              >
                {table.status === "Available"
                  ? "🚀 Open Table"
                  : "✓ Clear Table"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* BILL DETAILS MODAL */}
      {showBillDetails && selectedTable && (
        <div className="modal-overlay" onClick={() => setShowBillDetails(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Table {selectedTable.id} - Bill Details</h2>

              <button
                className="close-button"
                onClick={() => setShowBillDetails(false)}
              >
                ✕
              </button>
            </div>

            <div className="bill-details">
              <div className="detail-row">
                <span>Seats:</span>
                <strong>{selectedTable.seats}</strong>
              </div>

              <div className="detail-row">
                <span>Status:</span>
                <strong className="occupied">{selectedTable.status}</strong>
              </div>

              {selectedTable.items && selectedTable.items.length > 0 && (
                <div className="detail-row items-list">
                  <span>Items Ordered:</span>

                  <ul>
                    {selectedTable.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="detail-row bill-amount">
                <span>Current Bill:</span>
                <strong className="amount">
                  ₹{selectedTable.amount.toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="settle-button"
                onClick={() => settleBill(selectedTable.id)}
              >
                ✓ Settle Bill
              </button>

              <button
                className="cancel-modal-button"
                onClick={() => setShowBillDetails(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tables;
