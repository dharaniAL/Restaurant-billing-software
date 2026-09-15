import { useEffect, useState } from "react";

function Reports({ goBack }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("Today");

  const fetchReports = () => {
    setLoading(true);

    fetch("http://localhost:5000/api/reports")
      .then((response) => response.json())
      .then((data) => {
        console.log("Reports received:", data);

        if (data.success) {
          setReport(data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch reports:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ========================
  // CALCULATE P&L BASED ON FILTER
  // ========================

  const getProfitLossData = () => {
    if (!report) return { profit: 0, sales: 0, expenses: 0, percentChange: 0 };

    let sales = 0;
    let expenses = 0;

    if (timeFilter === "Today") {
      sales = report.today.today_sales || 0;
      expenses = report.expenses?.today_expenses || 0;
    } else if (timeFilter === "Month") {
      sales = report.sales?.total_sales || 0;
      expenses = report.expenses?.month_expenses || 0;
    } else if (timeFilter === "Year") {
      sales = report.sales?.total_sales || 0;
      expenses = report.expenses?.total_expenses || 0;
    }

    const profit = sales - expenses;
    const percentChange = sales > 0 ? ((profit / sales) * 100).toFixed(2) : 0;

    return { profit, sales, expenses, percentChange };
  };

  // ========================
  // GET PREVIOUS PERIOD DATA
  // ========================

  const getPreviousPeriodData = () => {
    if (!report) return { profit: 0, sales: 0 };

    // This would come from backend, defaulting for now
    const previousSales = report.today.yesterday_sales || 0;
    const previousExpenses = report.expenses?.yesterday_expenses || 0;

    return {
      sales: previousSales,
      profit: previousSales - previousExpenses,
    };
  };

  const current = getProfitLossData();
  const previous = getPreviousPeriodData();
  const maxValue = Math.max(current.sales, previous.sales) || 100;

  if (loading) {
    return (
      <div className="reports-page">
        <h1>Reports</h1>
        <p>Loading reports...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="reports-page">
        <h1>Reports</h1>
        <p>Unable to load reports.</p>

        <button onClick={goBack}>← Dashboard</button>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-header">
        <div>
          <p className="reports-label">BUSINESS REPORTS</p>

          <h1>Reports</h1>

          <p className="reports-subtitle">
            View your restaurant sales and payment reports.
          </p>
        </div>

        <button className="reports-back-button" onClick={goBack}>
          ← Dashboard
        </button>
      </div>

      {/* Summary Cards */}
      <div className="reports-summary">
        <div className="report-card">
          <span>Total Sales</span>

          <strong>
            ₹{report.sales.total_sales.toFixed(2)}
          </strong>

          <small>All completed bills</small>
        </div>

        <div className="report-card">
          <span>Total Bills</span>

          <strong>{report.sales.total_bills}</strong>

          <small>All generated bills</small>
        </div>

        <div className="report-card">
          <span>Today's Sales</span>

          <strong>
            ₹{report.today.today_sales.toFixed(2)}
          </strong>

          <small>{report.today.today_bills} bills today</small>
        </div>

        <div className="report-card">
          <span>Total Tax</span>

          <strong>
            ₹{report.sales.total_tax.toFixed(2)}
          </strong>

          <small>GST collected</small>
        </div>
      </div>

      {/* PROFIT & LOSS COMPARISON */}
      <section className="dashboard-card profit-card">
        <div className="card-heading">
          <div>
            <p className="card-label">BUSINESS PERFORMANCE</p>

            <h2>Profit & Loss Comparison</h2>
          </div>

          {/* FILTER */}
          <div className="profit-filter">
            <div className="filter-buttons">
              <button
                className={
                  timeFilter === "Today"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() => setTimeFilter("Today")}
              >
                Today
              </button>

              <button
                className={
                  timeFilter === "Month"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() => setTimeFilter("Month")}
              >
                This Month
              </button>

              <button
                className={
                  timeFilter === "Year"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() => setTimeFilter("Year")}
              >
                This Year
              </button>
            </div>
          </div>
        </div>

        {/* COMPARISON CHART */}
        <div className="profit-placeholder">
          <div className="profit-column">
            <span>Previous</span>

            <div className="bar previous-bar">
              <div
                className="bar-fill"
                style={{
                  height: `${(previous.sales / maxValue) * 100}%`,
                }}
              ></div>
            </div>

            <strong>₹{previous.sales.toFixed(2)}</strong>

            <small>Profit: ₹{previous.profit.toFixed(2)}</small>
          </div>

          <div className="profit-column">
            <span>Current</span>

            <div className="bar current-bar">
              <div
                className="bar-fill"
                style={{
                  height: `${(current.sales / maxValue) * 100}%`,
                }}
              ></div>
            </div>

            <strong>₹{current.sales.toFixed(2)}</strong>

            <small>Profit: ₹{current.profit.toFixed(2)}</small>
          </div>
        </div>

        {/* PERCENTAGE CHANGE */}
        <div className="profit-stats">
          <div className="stat-item">
            <span>Profit Margin</span>

            <strong className={current.percentChange >= 0 ? "positive" : "negative"}>
              {current.percentChange}%
            </strong>
          </div>

          <div className="stat-item">
            <span>Total Profit</span>

            <strong className={current.profit >= 0 ? "positive" : "negative"}>
              ₹{current.profit.toFixed(2)}
            </strong>
          </div>

          <div className="stat-item">
            <span>Total Expenses</span>

            <strong>₹{current.expenses.toFixed(2)}</strong>
          </div>
        </div>
      </section>

      {/* Sales Details */}
      <div className="reports-section">
        <div className="reports-section-header">
          <div>
            <p>SALES SUMMARY</p>

            <h2>Sales Details</h2>
          </div>
        </div>

        <div className="reports-details">
          <div>
            <span>Subtotal</span>
            <strong>
              ₹{report.sales.total_subtotal.toFixed(2)}
            </strong>
          </div>

          <div>
            <span>Tax</span>
            <strong>
              ₹{report.sales.total_tax.toFixed(2)}
            </strong>
          </div>

          <div>
            <span>Discount</span>
            <strong>
              ₹{report.sales.total_discount.toFixed(2)}
            </strong>
          </div>

          <div>
            <span>Final Sales</span>
            <strong>
              ₹{report.sales.total_sales.toFixed(2)}
            </strong>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="reports-section">
        <div className="reports-section-header">
          <div>
            <p>PAYMENT ANALYSIS</p>

            <h2>Payment Methods</h2>
          </div>
        </div>

        {report.payments.length === 0 ? (
          <div className="no-reports">
            <h3>No payment data available</h3>

            <p>Generate a bill to see payment information.</p>
          </div>
        ) : (
          <div className="payment-report-table">
            <div className="payment-report-row payment-report-header">
              <span>Payment Method</span>
              <span>Bills</span>
              <span>Total Amount</span>
              <span>Percentage</span>
            </div>

            {report.payments.map((payment) => {
              const totalSales = report.sales.total_sales || 1;
              const percentage = ((payment.total / totalSales) * 100).toFixed(1);

              return (
                <div
                  className="payment-report-row"
                  key={payment.payment_method}
                >
                  <strong>{payment.payment_method}</strong>

                  <span>{payment.bill_count}</span>

                  <strong>
                    ₹{payment.total.toFixed(2)}
                  </strong>

                  <span className="percentage">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
