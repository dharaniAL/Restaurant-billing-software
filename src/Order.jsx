import { useEffect, useState } from "react";

function Orders({ goBack, currentUser }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET ORDERS FROM BACKEND
  // =========================

  const fetchOrders = () => {
    setLoading(true);

    fetch("http://localhost:5000/api/orders")
      .then((response) => response.json())
      .then((data) => {
        console.log("Orders received:", data);

        if (data.success) {
          const convertedOrders = data.orders.map((order) => ({
            id: `#${order.bill_number}`,

            customer: order.customer_name,

            items: order.items || "-",

            type: order.order_type,

            amount: order.total,

            orderTime: order.order_time
  ? new Date(
      order.order_time.replace(" ", "T") + "Z"
    ).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  : "-",

readyTime: order.ready_time
  ? new Date(
      order.ready_time.replace(" ", "T") + "Z"
    ).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  : "-",

deliveredTime: order.delivered_time
  ? new Date(
      order.delivered_time.replace(" ", "T") + "Z"
    ).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  : "-",

            status: order.status,

            orderId: order.order_id,
          }));

          setOrders(convertedOrders);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch orders:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // CHANGE STATUS
  // =========================

  const changeStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
         body: JSON.stringify({
  status: newStatus,
  user_id: currentUser?.id,
}),
        }
      );

      const data = await response.json();

      console.log("Status response:", data);

      if (data.success) {
        setOrders(
          orders.map((order) =>
            order.orderId === orderId
              ? {
                  ...order,
                  status: newStatus,
                }
              : order
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Cannot connect to backend.");
    }
  };

  // =========================
  // FILTER ORDERS
  // =========================

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    const matchesType =
      typeFilter === "All" ||
      order.type === typeFilter;

    const searchText = search.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(searchText) ||
      (order.customer || "").toLowerCase().includes(searchText) ||
      (order.items||"").toLowerCase().includes(searchText);

    return (
      matchesStatus &&
      matchesType &&
      matchesSearch
    );
  });

  return (
    <div className="orders-page">

      {/* HEADER */}

      <div className="orders-header">
        <div>
          <p className="orders-label">
            ORDER MANAGEMENT
          </p>

          <h1>Orders</h1>

          <p className="orders-subtitle">
            Track and manage all restaurant orders.
          </p>
        </div>

        <button
          className="orders-back-button"
          onClick={goBack}
        >
          ← Dashboard
        </button>
      </div>


      {/* SUMMARY */}

      <div className="orders-summary">

        <div className="order-summary-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="order-summary-card">
          <span>Processing</span>

          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === "Processing"
              ).length
            }
          </strong>
        </div>

        <div className="order-summary-card">
          <span>Preparing</span>

          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === "Preparing"
              ).length
            }
          </strong>
        </div>

        <div className="order-summary-card">
          <span>Delivered</span>

          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === "Delivered"
              ).length
            }
          </strong>
        </div>

      </div>


      {/* FILTERS */}

      <div className="orders-filter-card">

        <input
          type="text"
          className="orders-search"
          placeholder="Search order, customer or food..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
        >
          <option value="All">
            All Types
          </option>

          <option value="Dine-in">
            Dine-in
          </option>

          <option value="Takeaway">
            Takeaway
          </option>

          <option value="Delivery">
            Delivery
          </option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

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

      </div>


      {/* ORDERS TABLE */}

      <div className="orders-card">

        {loading ? (

          <div className="no-orders">
            <h2>Loading orders...</h2>

            <p>
              Getting orders from the database.
            </p>
          </div>

        ) : (

          <div className="orders-table">

            <div className="orders-row orders-table-header">
              <span>Order</span>
              <span>Customer</span>
              <span>Items</span>
              <span>Type</span>
              <span>Order Time</span>
              <span>Amount</span>
              <span>Status</span>
            </div>


            {filteredOrders.map((order) => (

              <div
                className="orders-row"
                key={order.orderId}
              >

                <strong>
                  {order.id}
                </strong>

                <span>
                  {order.customer}
                </span>

                <span className="order-items">
                  {order.items}
                </span>

                <span className="order-type">
                  {order.type}
                </span>

                <div className="order-times">
  <span>
    Order: {order.orderTime}
  </span>

  <span>
    Ready: {order.readyTime}
  </span>

  <span>
    Delivered: {order.deliveredTime}
  </span>
</div>

                <strong>
                  ₹{order.amount.toFixed(2)}
                </strong>

                <select
                  className={`order-status ${order.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                  value={order.status}
                  onChange={(e) =>
                    changeStatus(
                      order.orderId,
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

              </div>

            ))}

          </div>

        )}


        {!loading && filteredOrders.length === 0 && (
          <div className="no-orders">

            <h2>No orders found</h2>

            <p>
              Try changing your search or filters.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default Orders;