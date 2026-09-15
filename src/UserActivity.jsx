import { useEffect, useState } from "react";

function UserActivity({ goBack }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // FETCH USER ACTIVITY
  // ===============================

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/user-activity"
      );

      const data = await response.json();

      console.log("User activity:", data);

      if (data.success) {
        setActivities(data.logs || []);
      } else {
        setError(
          data.message || "Failed to load user activity."
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch user activity:",
        error
      );

      setError(
        "Cannot connect to backend. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD ACTIVITY
  // ===============================

  useEffect(() => {
    fetchActivities();
  }, []);

  // ===============================
  // FORMAT DATE & TIME
  // ===============================

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(
      dateString.replace(" ", "T") + "Z"
    );

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // ===============================
  // FORMAT MONEY
  // ===============================

  const money = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return `₹${Number(value).toFixed(2)}`;
  };

  // ===============================
  // ACTION LABEL
  // ===============================

  const getActionLabel = (actionType) => {
    switch (actionType) {
      case "LOGIN":
        return "Login";

      case "ORDER_CREATED":
        return "Order Created";

      case "ORDER_STATUS_UPDATED":
        return "Order Status Updated";

      case "EXPENSE_ADDED":
        return "Expense Added";

      case "BILL_CREATED":
        return "Bill Created";

      default:
        return actionType || "Activity";
    }
  };

  // ===============================
  // ACTION CLASS
  // ===============================

  const getActionClass = (actionType) => {
    switch (actionType) {
      case "LOGIN":
        return "activity-login";

      case "ORDER_CREATED":
        return "activity-order";

      case "ORDER_STATUS_UPDATED":
        return "activity-status";

      case "EXPENSE_ADDED":
        return "activity-expense";

      case "BILL_CREATED":
        return "activity-bill";

      default:
        return "activity-default";
    }
  };

  // ===============================
  // PAGE
  // ===============================

  return (
    <div className="user-activity-page">

      {/* HEADER */}

      <div className="user-activity-header">

        <div>
          <p className="activity-small-title">
            USER MANAGEMENT
          </p>

          <h1>User Activity</h1>

          <p>
            Track user actions and activities in
            your restaurant software.
          </p>
        </div>

        <div className="activity-header-buttons">

          <button
            className="activity-refresh-button"
            onClick={fetchActivities}
          >
            Refresh
          </button>

          <button
            className="activity-back-button"
            onClick={goBack}
          >
            Back
          </button>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="activity-summary">

        <div className="activity-summary-card">
          <span>Total Activities</span>

          <strong>
            {activities.length}
          </strong>
        </div>

        <div className="activity-summary-card">
          <span>Users</span>

          <strong>
            {
              new Set(
                activities.map(
                  (activity) =>
                    activity.user_id
                )
              ).size
            }
          </strong>
        </div>

        <div className="activity-summary-card">
          <span>Orders</span>

          <strong>
            {
              activities.filter(
                (activity) =>
                  activity.action_type ===
                  "ORDER_CREATED"
              ).length
            }
          </strong>
        </div>

        <div className="activity-summary-card">
          <span>Expenses</span>

          <strong>
            {
              activities.filter(
                (activity) =>
                  activity.action_type ===
                  "EXPENSE_ADDED"
              ).length
            }
          </strong>
        </div>

      </div>

      {/* ACTIVITY TABLE */}

      <div className="activity-card">

        <div className="activity-card-header">

          <div>
            <p className="activity-card-label">
              ACTIVITY LOG
            </p>

            <h2>
              User Activity Details
            </h2>
          </div>

          <span className="activity-count">
            {activities.length} records
          </span>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="activity-message">
            Loading user activity...
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="activity-error">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          activities.length === 0 && (
            <div className="activity-message">
              No user activity found.
            </div>
          )}

        {/* TABLE */}

        {!loading &&
          !error &&
          activities.length > 0 && (
            <div className="activity-table-wrapper">

              <table className="activity-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Details</th>
                    <th>Bill Number</th>
                    <th>Order ID</th>
                    <th>Payment</th>
                    <th>Amount</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>

                <tbody>

                  {activities.map(
                    (activity, index) => (
                      <tr key={activity.id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {activity.username ||
                              "Unknown"}
                          </strong>

                          <small>
                            ID:{" "}
                            {activity.user_id}
                          </small>
                        </td>

                        <td>
                          <span
                            className={`activity-badge ${getActionClass(
                              activity.action_type
                            )}`}
                          >
                            {getActionLabel(
                              activity.action_type
                            )}
                          </span>
                        </td>

                        <td className="activity-details">
                          {activity.details || "-"}
                        </td>

                        <td>
                          {activity.bill_number ||
                            "-"}
                        </td>

                        <td>
                          {activity.order_id ||
                            "-"}
                        </td>

                        <td>
                          {activity.payment_method ||
                            "-"}
                        </td>

                        <td>
                          <strong>
                            {money(
                              activity.amount
                            )}
                          </strong>
                        </td>

                        <td>
                          {formatDateTime(
                            activity.created_at
                          )}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

      </div>

    </div>
  );
}

export default UserActivity;