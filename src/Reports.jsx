import { useEffect, useState } from "react";

function Reports({ goBack }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    setLoading(true);

    fetch("https://restaurant-billing-backend-jqh6.onrender.com/api/reports")
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

        <button onClick={goBack}>
          ← Dashboard
        </button>
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

        <button
          className="reports-back-button"
          onClick={goBack}
        >
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

          <strong>
            {report.sales.total_bills}
          </strong>

          <small>All generated bills</small>
        </div>

        <div className="report-card">
          <span>Today's Sales</span>

          <strong>
            ₹{report.today.today_sales.toFixed(2)}
          </strong>

          <small>
            {report.today.today_bills} bills today
          </small>
        </div>

        <div className="report-card">
          <span>Total Tax</span>

          <strong>
            ₹{report.sales.total_tax.toFixed(2)}
          </strong>

          <small>GST collected</small>
        </div>

      </div>

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

            <p>
              Generate a bill to see payment information.
            </p>
          </div>
        ) : (
          <div className="payment-report-table">

            <div className="payment-report-row payment-report-header">
              <span>Payment Method</span>
              <span>Bills</span>
              <span>Total Amount</span>
            </div>

            {report.payments.map((payment) => (
              <div
                className="payment-report-row"
                key={payment.payment_method}
              >
                <strong>
                  {payment.payment_method}
                </strong>

                <span>
                  {payment.bill_count}
                </span>

                <strong>
                  ₹{payment.total.toFixed(2)}
                </strong>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Reports;