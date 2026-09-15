import { useEffect, useState } from "react";
import "./App.css";

import restaurantBg from "./assets/restaurant-bg.jpg";

import Billing from "./Billing.jsx";
import Menu from "./Menu.jsx";
import Orders from "./Order.jsx";
import Tables from "./Tables.jsx";
import Delivery from "./Delivery.jsx";
import Reports from "./Reports.jsx";
import Settings from "./Setting.jsx";
import Expenses from "./Expenses.jsx";
import UserActivity from "./UserActivity.jsx";

function App() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [dashboardData, setDashboardData] = useState(null);

  const [comparisonPeriod, setComparisonPeriod] =
    useState("today");

  const [currentTime, setCurrentTime] = useState(
    new Date()
  );

  // ===============================
  // LIVE DATE & TIME
  // ===============================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ===============================
  // FETCH DASHBOARD
  // ===============================

  const fetchDashboard = async (period = comparisonPeriod) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/dashboard?period=${period}`
      );

      const data = await response.json();

      console.log("Dashboard data:", data);

      if (data.success) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error(
        "Failed to fetch dashboard:",
        error
      );
    }
  };

  useEffect(() => {
    if (!loggedIn) return;

    fetchDashboard(comparisonPeriod);
  }, [loggedIn, comparisonPeriod]);

  // ===============================
  // LOGIN
  // ===============================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!userId || !password) {
      setError("Please enter User ID and Password.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userId,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (data.success) {
        setCurrentUser(data.user);
        setLoggedIn(true);
        setCurrentPage("dashboard");
        setError("");
        setPassword("");
      } else {
        setError(
          data.message ||
            "Invalid username or password."
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Cannot connect to backend. Please start the server."
      );
    }
  };

  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage("dashboard");
    setDashboardData(null);
    setUserId("");
    setPassword("");
    setError("");
  };

  // ===============================
  // FORMAT MONEY
  // ===============================

  const money = (value) => {
    return `₹${Number(value || 0).toFixed(2)}`;
  };

  // ===============================
  // PAYMENT HELPER
  // ===============================

  const getPaymentTotal = (method) => {
    if (!dashboardData) return 0;

    return Number(
      dashboardData.payments?.find(
        (payment) =>
          payment.payment_method === method
      )?.total || 0
    );
  };

  // ===============================
  // PERIOD LABEL
  // ===============================

  const getPeriodLabel = () => {
    if (comparisonPeriod === "month") {
      return "This Month vs Previous Month";
    }

    if (comparisonPeriod === "year") {
      return "This Year vs Previous Year";
    }

    return "Today vs Yesterday";
  };

  // ===============================
  // DASHBOARD
  // ===============================

  if (loggedIn) {
    const currentProfit = Number(
      dashboardData?.currentProfit?.current_profit || 0
    );

    const previousProfit = Number(
      dashboardData?.previousProfit?.previous_profit || 0
    );

    const profitMax = Math.max(
      Math.abs(currentProfit),
      Math.abs(previousProfit),
      1
    );

    const currentBarHeight =
      Math.max(
        (Math.abs(currentProfit) / profitMax) * 160,
        8
      );

    const previousBarHeight =
      Math.max(
        (Math.abs(previousProfit) / profitMax) * 160,
        8
      );

    return (
      <div className="dashboard">
        {/* ===============================
            SIDEBAR
        =============================== */}

        <aside className="sidebar">
          <div className="brand">
            <div className="logo_icon">JK</div>

            <div>
              <h2>JK Restaurant</h2>
              <span>Billing Software</span>
            </div>
          </div>

          <nav className="sidebar-menu">
            <button
              className={
                currentPage === "dashboard"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setCurrentPage("dashboard")
              }
            >
              Dashboard
            </button>

            <button
              className={
                currentPage === "billing"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setCurrentPage("billing")
              }
            >
              Billing
            </button>

            <button
              className={
                currentPage === "menu"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setCurrentPage("menu")
              }
            >
              Menu
            </button>

            <button
              className={
                currentPage === "tables"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setCurrentPage("tables")
              }
            >
              Tables
            </button>

            <button
              className={
                currentPage === "orders"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setCurrentPage("orders")
              }
            >
              Orders
            </button>

            <button
              className={
                currentPage === "delivery"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setCurrentPage("delivery")
              }
            >
              Delivery
            </button>

            <button
              className={
                currentPage === "expenses"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setCurrentPage("expenses")
              }
            >
              Expenses
            </button>

            <button
              className={
                currentPage === "reports"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setCurrentPage("reports")
              }
            >
              Reports
            </button>
<button
  className={
    currentPage === "userActivity"
      ? "menu-item active"
      : "menu-item"
  }
  onClick={() => setCurrentPage("userActivity")}
>
  User Activity
</button>
            <button
              className={
                currentPage === "settings"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setCurrentPage("settings")
              }
            >
              Settings
            </button>
          </nav>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </aside>

        {/* ===============================
            BILLING
        =============================== */}

        {currentPage === "billing" ? (
          <main className="dashboard-content">
            <Billing
              goBack={() =>
                setCurrentPage("dashboard")
              }
              currentUser={currentUser}
            />
          </main>
        ) : null}

        {/* ===============================
            MENU
        =============================== */}

        {currentPage === "menu" ? (
          <main className="dashboard-content">
            <Menu
              goBack={() =>
                setCurrentPage("dashboard")
              }
            />
          </main>
        ) : null}

        {/* ===============================
            TABLES
        =============================== */}

        {currentPage === "tables" ? (
          <main className="dashboard-content">
           <Tables
  goBack={() => setCurrentPage("dashboard")}
  currentUser={currentUser}
/>
          </main>
        ) : null}

        {/* ===============================
            ORDERS
        =============================== */}

        {currentPage === "orders" ? (
          <main className="dashboard-content">
            <Orders
              goBack={() =>
                setCurrentPage("dashboard")
              }
              currentUser={currentUser}
            />
          </main>
        ) : null}

        {/* ===============================
            DELIVERY
        =============================== */}

        {currentPage === "delivery" ? (
          <main className="dashboard-content">
            <Delivery
              goBack={() =>
                setCurrentPage("dashboard")
              }
              currentUser={currentUser}
            />
          </main>
        ) : null}

        {/* ===============================
            EXPENSES
        =============================== */}

        {currentPage === "expenses" ? (
          <main className="dashboard-content">
            <Expenses
              goBack={() =>
                setCurrentPage("dashboard")
              }
              currentUser={currentUser}
            />
          </main>
        ) : null}

        {/* ===============================
            REPORTS
        =============================== */}

        {currentPage === "reports" ? (
          <main className="dashboard-content">
            <Reports
              goBack={() =>
                setCurrentPage("dashboard")
              }
            />
          </main>
        ) : null}

{currentPage === "userActivity" ? (
  <main className="dashboard-content">
    <UserActivity
      goBack={() => setCurrentPage("dashboard")}
      currentUser={currentUser}
    />
  </main>
) : null}
        {/* ===============================
            SETTINGS
        =============================== */}

        {currentPage === "settings" ? (
          <main className="dashboard-content">
            <Settings
              goBack={() =>
                setCurrentPage("dashboard")
              }
            />
          </main>
        ) : null}

        {/* ===============================
            DASHBOARD HOME
        =============================== */}

        {currentPage === "dashboard" ? (
          <main className="dashboard-content">
            {/* HEADER */}

            <header className="dashboard-header">
              <div>
                <p className="header-small">
                  JK RESTAURANT
                </p>

                <h1>
                  Hello{" "}
                  {currentUser?.username || "User"}
                </h1>

                <p className="header-subtitle">
                  Here's what's happening in your
                  restaurant today.
                </p>
              </div>

              <div className="notification">
                🔔
              </div>

              <div className="profile">
                {currentUser?.username || "User"}
              </div>

              <div className="date-time">
                <strong>
                  {currentTime.toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </strong>

                <span>
                  {currentTime.toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }
                  )}
                </span>
              </div>
            </header>

            {/* SUMMARY */}

            <section className="summary-grid">
              <div className="summary-card">
                <p>Today's Sales</p>

                <h2>
                  {money(
                    dashboardData?.today
                      ?.today_sales
                  )}
                </h2>

                <span className="positive">
                  Today's completed sales
                </span>
              </div>

              <div className="summary-card">
                <p>Today's Profit</p>

                <h2>
                  {money(
                    Number(
                      dashboardData?.today
                        ?.today_sales || 0
                    ) -
                      Number(
                        dashboardData?.expenses
                          ?.today_expenses || 0
                      )
                  )}
                </h2>

                <span className="positive">
                  Sales − Expenses
                </span>
              </div>

              <div className="summary-card">
                <p>Online Orders</p>

                <h2>
                  {dashboardData?.orders
                    ?.total_orders || 0}
                </h2>

                <span>
                  Today's delivery orders
                </span>
              </div>

              <div className="summary-card">
                <p>Today's Bills</p>

                <h2>
                  {dashboardData?.today
                    ?.today_bills || 0}
                </h2>

                <span>
                  Bills generated today
                </span>
              </div>
            </section>

            {/* PAYMENT + DELIVERY */}

            <section className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-heading">
                  <div>
                    <p className="card-label">
                      PAYMENTS
                    </p>

                    <h2>
                      Today's Payment Summary
                    </h2>
                  </div>
                </div>

                <div className="payment-list">
                  <div className="payment-row">
                    <span>Cash</span>

                    <strong>
                      {money(
                        getPaymentTotal("Cash")
                      )}
                    </strong>
                  </div>

                  <div className="payment-row">
                    <span>Card</span>

                    <strong>
                      {money(
                        getPaymentTotal("Card")
                      )}
                    </strong>
                  </div>

                  <div className="payment-row">
                    <span>UPI</span>

                    <strong>
                      {money(
                        getPaymentTotal("UPI")
                      )}
                    </strong>
                  </div>

                  <div className="payment-row">
                    <span>Other</span>

                    <strong>
                      {money(
                        getPaymentTotal("Other")
                      )}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-heading">
                  <div>
                    <p className="card-label">
                      DELIVERY
                    </p>

                    <h2>
                      Delivery Status
                    </h2>
                  </div>
                </div>

                <div className="delivery-row">
                  <div>
                    <strong>Preparing</strong>
                    <span>
                      {dashboardData?.orders
                        ?.preparing_delivery ||
                        0}{" "}
                      orders
                    </span>
                  </div>

                  <span className="status preparing">
                    Preparing
                  </span>
                </div>

                <div className="delivery-row">
                  <div>
                    <strong>Processing</strong>
                    <span>
                      {dashboardData?.orders
                        ?.processing_delivery ||
                        0}{" "}
                      orders
                    </span>
                  </div>

                  <span className="status processing">
                    Processing
                  </span>
                </div>

                <div className="delivery-row">
                  <div>
                    <strong>Ready</strong>
                    <span>
                      {dashboardData?.orders
                        ?.ready_delivery || 0}{" "}
                      orders
                    </span>
                  </div>

                  <span className="status ready">
                    Ready
                  </span>
                </div>

                <div className="delivery-row">
                  <div>
                    <strong>Delivered</strong>
                    <span>
                      {dashboardData?.orders
                        ?.delivered_delivery ||
                        0}{" "}
                      orders
                    </span>
                  </div>

                  <span className="status delivered">
                    Delivered
                  </span>
                </div>
              </div>
            </section>

            {/* PROFIT & LOSS */}

            <section className="dashboard-card profit-card">
              <div className="card-heading">
                <div>
                  <p className="card-label">
                    BUSINESS PERFORMANCE
                  </p>

                  <h2>
                    Profit & Loss Comparison
                  </h2>
                </div>

                <div className="profit-filter">
                  <button className="filter-button">
                    {comparisonPeriod === "today"
                      ? "Today"
                      : comparisonPeriod === "month"
                      ? "This Month"
                      : "This Year"}{" "}
                    ▾
                  </button>

                  <div className="filter-menu">
                    <button
                      onClick={() =>
                        setComparisonPeriod("today")
                      }
                    >
                      Today
                    </button>

                    <button
                      onClick={() =>
                        setComparisonPeriod("month")
                      }
                    >
                      This Month
                    </button>

                    <button
                      onClick={() =>
                        setComparisonPeriod("year")
                      }
                    >
                      This Year
                    </button>
                  </div>
                </div>
              </div>

              <p
                style={{
                  textAlign: "center",
                  marginBottom: "15px",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                {getPeriodLabel()}
              </p>

              <div className="profit-placeholder">
                <div className="profit-column">
                  <span>Previous</span>

                  <div
                    className="bar previous-bar"
                    style={{
                      height: `${previousBarHeight}px`,
                    }}
                  ></div>

                  <strong>
                    {money(previousProfit)}
                  </strong>
                </div>

                <div className="profit-column">
                  <span>Current</span>

                  <div
                    className="bar current-bar"
                    style={{
                      height: `${currentBarHeight}px`,
                    }}
                  ></div>

                  <strong>
                    {money(currentProfit)}
                  </strong>
                </div>
              </div>
            </section>

            {/* RECENT BILLS */}

            <section className="dashboard-card bills-card">
              <div className="card-heading">
                <div>
                  <p className="card-label">
                    RECENT ACTIVITY
                  </p>

                  <h2>Recent Bills</h2>
                </div>
              </div>

              <div className="bill-table">
                <div className="bill-row bill-header">
                  <span>Bill</span>
                  <span>Time</span>
                  <span>Payment</span>
                  <span>Amount</span>
                </div>

                {dashboardData &&
                dashboardData.recentOrders &&
                dashboardData.recentOrders.length >
                  0 ? (
                  dashboardData.recentOrders
                    .slice(0, 5)
                    .map((bill) => (
                      <div
                        className="bill-row"
                        key={bill.order_id}
                      >
                        <span>
                          #{bill.bill_number}
                        </span>

                        <span>
                          {bill.order_time
                            ? new Date(
                                bill.order_time.replace(
                                  " ",
                                  "T"
                                ) + "Z"
                              ).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute:
                                    "2-digit",
                                }
                              )
                            : "-"}
                        </span>

                        <span>
                          {bill.payment_method}
                        </span>

                        <strong>
                          {money(bill.total)}
                        </strong>
                      </div>
                    ))
                ) : (
                  <div className="bill-row">
                    <span>No bills</span>
                    <span>-</span>
                    <span>-</span>
                    <strong>₹0.00</strong>
                  </div>
                )}
              </div>
            </section>
          </main>
        ) : null}
      </div>
    );
  }

  // ===============================
  // LOGIN PAGE
  // ===============================

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${restaurantBg})`,
      }}
    >
      <div className="overlay"></div>

      <div className="login-container">
        <div className="welcome-section">
          <p className="small-title">
            WELCOME TO
          </p>

          <h1>JK</h1>

          <h2>Restaurant</h2>

          <p>
            Restaurant Billing & Management
            <br />
            Made Simple.
          </p>
        </div>

        <div className="login-card">
          <div className="brand">
            <span>JK</span>

            <h2>Welcome Back</h2>

            <p>
              Login to your restaurant dashboard
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>User ID</label>

              <input
                type="text"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) =>
                  setUserId(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="password-box">
                <span className="lock-icon">
                  🔑
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>
          </form>

          <p className="login-footer">
            JK Restaurant Billing Software
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;