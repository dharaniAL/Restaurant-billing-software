import { useEffect, useState } from "react";

function Delivery({ goBack, currentUser }) {
  const [filter, setFilter] = useState("All");

  const [deliveries, setDeliveries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ===============================
  // FETCH DELIVERIES
  // ===============================

  const fetchDeliveries = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://restaurant-billing-backend-jqh6.onrender.com/api/deliveries"
      );

      const data = await response.json();

      console.log(
        "Deliveries received:",
        data
      );

      if (data.success) {
        const convertedDeliveries =
          data.deliveries.map(
            (delivery) => ({
              id: `#${delivery.bill_number}`,

              orderId:
                delivery.order_id,

              customer:
                delivery.customer_name,

              amount:
                Number(delivery.total) || 0,

              status:
                delivery.status,

              time: delivery.order_time
                ? new Date(
                    delivery.order_time.replace(
                      " ",
                      "T"
                    ) + "Z"
                  ).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "-",

              readyTime:
                delivery.ready_time
                  ? new Date(
                      delivery.ready_time.replace(
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
                  : "-",

              deliveredTime:
                delivery.delivered_time
                  ? new Date(
                      delivery.delivered_time.replace(
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
                  : "-",
            })
          );

        setDeliveries(
          convertedDeliveries
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch deliveries:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // ===============================
  // CHANGE STATUS
  // ===============================

  const changeStatus = async (
    orderId,
    newStatus
  ) => {
    if (!currentUser?.id) {
      alert(
        "User information is missing."
      );
      return;
    }

    try {
      const response = await fetch(
        `https://restaurant-billing-backend-jqh6.onrender.com/api/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
            user_id: currentUser.id,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Delivery status response:",
        data
      );

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Failed to update status."
        );
        return;
      }

      await fetchDeliveries();
    } catch (error) {
      console.error(
        "Delivery status update error:",
        error
      );

      alert(
        "Cannot connect to backend."
      );
    }
  };

  // ===============================
  // FILTER
  // ===============================

  const filteredDeliveries =
    filter === "All"
      ? deliveries
      : deliveries.filter(
          (delivery) =>
            delivery.status === filter
        );

  // ===============================
  // SUMMARY
  // ===============================

  const totalOrders =
    deliveries.length;

  const deliveredOrders =
    deliveries.filter(
      (delivery) =>
        delivery.status === "Delivered"
    ).length;

  const processingOrders =
    deliveries.filter(
      (delivery) =>
        delivery.status === "Processing"
    ).length;

  const preparingOrders =
    deliveries.filter(
      (delivery) =>
        delivery.status === "Preparing"
    ).length;

  const readyOrders =
    deliveries.filter(
      (delivery) =>
        delivery.status === "Ready"
    ).length;

  // ===============================
  // RENDER
  // ===============================

  return (
    <div className="delivery-page">
      {/* HEADER */}

      <div className="delivery-header">
        <div>
          <p className="delivery-label">
            ONLINE DELIVERY
          </p>

          <h1>
            Delivery Management
          </h1>

          <p className="delivery-subtitle">
            Manage and track all online
            delivery orders.
          </p>
        </div>

        <button
          className="delivery-back-button"
          onClick={goBack}
        >
          ← Dashboard
        </button>
      </div>

      {/* SUMMARY */}

      <section className="delivery-summary">
        <div className="delivery-summary-card">
          <span>Total Orders</span>

          <strong>
            {totalOrders}
          </strong>

          <small>
            Delivery orders
          </small>
        </div>

        <div className="delivery-summary-card">
          <span>Preparing</span>

          <strong>
            {preparingOrders}
          </strong>

          <small>
            Orders being prepared
          </small>
        </div>

        <div className="delivery-summary-card">
          <span>Processing</span>

          <strong>
            {processingOrders}
          </strong>

          <small>
            Waiting for delivery
          </small>
        </div>

        <div className="delivery-summary-card">
          <span>Ready</span>

          <strong>
            {readyOrders}
          </strong>

          <small>
            Ready for delivery
          </small>
        </div>

        <div className="delivery-summary-card">
          <span>Delivered</span>

          <strong>
            {deliveredOrders}
          </strong>

          <small>
            Successfully completed
          </small>
        </div>
      </section>

      {/* DELIVERY MANAGEMENT */}

      <section className="delivery-management-card">
        <div className="delivery-card-top">
          <div>
            <p>
              ORDER MANAGEMENT
            </p>

            <h2>
              Online Delivery Orders
            </h2>
          </div>

          {/* FILTERS */}

          <div className="delivery-filters">
            {[
              "All",
              "Preparing",
              "Processing",
              "Ready",
              "Delivered",
            ].map((item) => (
              <button
                key={item}
                className={
                  filter === item
                    ? "delivery-filter active"
                    : "delivery-filter"
                }
                onClick={() =>
                  setFilter(item)
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}

        <div className="delivery-table">
          <div className="delivery-table-row delivery-table-header">
            <span>Order</span>
            <span>Customer</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Time</span>
          </div>

          {loading ? (
            <div className="no-orders">
              <h2>
                Loading deliveries...
              </h2>

              <p>
                Getting delivery orders
                from the database.
              </p>
            </div>
          ) : filteredDeliveries.length >
            0 ? (
            filteredDeliveries.map(
              (delivery) => (
                <div
                  className="delivery-table-row"
                  key={delivery.orderId}
                >
                  <strong>
                    {delivery.id}
                  </strong>

                  <span>
                    {delivery.customer}
                  </span>

                  <strong>
                    ₹
                    {delivery.amount.toFixed(
                      2
                    )}
                  </strong>

                  <select
                    className={`delivery-status ${delivery.status
                      .toLowerCase()
                      .replace(
                        " ",
                        "-"
                      )}`}
                    value={
                      delivery.status
                    }
                    onChange={(e) =>
                      changeStatus(
                        delivery.orderId,
                        e.target.value
                      )
                    }
                  >
                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Preparing">
                      Preparing
                    </option>

                    <option value="Ready">
                      Ready
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>
                  </select>

                  <div className="order-times">
                    <span>
                      Order:{" "}
                      {delivery.time}
                    </span>

                    <span>
                      Ready:{" "}
                      {delivery.readyTime}
                    </span>

                    <span>
                      Delivered:{" "}
                      {
                        delivery.deliveredTime
                      }
                    </span>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="no-orders">
              <h2>
                No delivery orders found
              </h2>

              <p>
                Delivery orders created
                from Billing will appear
                here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Delivery;