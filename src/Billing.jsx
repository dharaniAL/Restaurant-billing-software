import { useState } from "react";

import chickenBiryani from "./assets/chicken-biryani.jpg";
import vegBiryani from "./assets/veg-biryani.jpg";
import friedRice from "./assets/fried-rice.jpg";
import paneer from "./assets/paneer.jpg";
import dosa from "./assets/dosa.jpg";
import idli from "./assets/idli.jpg";
import limeJuice from "./assets/lime-juice.jpg";
import coldCoffee from "./assets/cold-coffee.jpg";

function Billing({ goBack, currentUser }) {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("Dine-in");
  const [table, setTable] = useState("T1");
  const [payment, setPayment] = useState("Cash");

  const menuItems = [
    {
      id: 1,
      name: "Chicken Biryani",
      category: "Main Course",
      price: 220,
      image: chickenBiryani,
    },
    {
      id: 2,
      name: "Veg Biryani",
      category: "Main Course",
      price: 180,
      image: vegBiryani,
    },
    {
      id: 3,
      name: "Chicken Fried Rice",
      category: "Rice",
      price: 190,
      image: friedRice,
    },
    {
      id: 4,
      name: "Paneer Butter Masala",
      category: "Main Course",
      price: 210,
      image: paneer,
    },
    {
      id: 5,
      name: "Masala Dosa",
      category: "Breakfast",
      price: 90,
      image: dosa,
    },
    {
      id: 6,
      name: "Idli",
      category: "Breakfast",
      price: 60,
      image: idli,
    },
    {
      id: 7,
      name: "Fresh Lime Juice",
      category: "Drinks",
      price: 70,
      image: limeJuice,
    },
    {
      id: 8,
      name: "Cold Coffee",
      category: "Drinks",
      price: 120,
      image: coldCoffee,
    },
  ];

  const categories = [
    "All",
    "Main Course",
    "Rice",
    "Breakfast",
    "Drinks",
  ];

  const filteredItems =
    category === "All"
      ? menuItems
      : menuItems.filter(
          (item) => item.category === category
        );

  const addToCart = (item) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.05;

  const total = subtotal + tax;

  const generateBill = async () => {
  if (cart.length === 0) {
    alert("Please add at least one item.");
    return;
  }

  const billNumber = `JK${Date.now()}`;

 const billData = {
  bill_number: billNumber,
  user_id: currentUser?.id,
  order_type: orderType,
  table_number: orderType === "Dine-in" ? table : null,
    subtotal: subtotal,
    tax: tax,
    discount: 0,
    total: total,
    payment_method: payment,

    items: cart.map((item) => ({
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    })),
  };

  try {
    const response = await fetch(
      "https://restaurant-billing-backend-jqh6.onrender.com/api/bills",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      }
    );

    const data = await response.json();

    console.log("Bill response:", data);

    if (data.success) {
      alert(
        `Bill generated successfully!\n\nBill No: ${billNumber}\nTotal: ₹${total.toFixed(
          2
        )}\nPayment: ${payment}`
      );

      setCart([]);
    } else {
      alert(data.message || "Failed to create bill.");
    }
  } catch (error) {
    console.error("Billing error:", error);
    alert("Cannot connect to backend.");
  }
};

  return (
    <div className="billing-page">

      {/* HEADER */}

      <div className="billing-topbar">
        <div>
          <p className="billing-label">
            BILLING
          </p>

          <h1>
            Create New Bill
          </h1>

          <p>
            Add food items and complete the customer payment.
          </p>
        </div>

        <button
          className="back-dashboard"
          onClick={goBack}
        >
          ← Dashboard
        </button>
      </div>


      {/* ORDER SETTINGS */}

      <div className="billing-settings">

        <div className="setting-box">
          <label>
            Order Type
          </label>

          <select
            value={orderType}
            onChange={(e) =>
              setOrderType(e.target.value)
            }
          >
            <option>Dine-in</option>
            <option>Takeaway</option>
            <option>Delivery</option>
          </select>
        </div>


        <div className="setting-box">
          <label>
            Table
          </label>

          <select
            value={table}
            onChange={(e) =>
              setTable(e.target.value)
            }
          >
            <option>T1</option>
            <option>T2</option>
            <option>T3</option>
            <option>T4</option>
            <option>T5</option>
          </select>
        </div>

      </div>


      {/* MAIN BILLING AREA */}

      <div className="billing-layout">

        {/* MENU */}

        <section className="food-section">

          <div className="section-heading">
            <div>
              <p className="billing-label">
                MENU
              </p>

              <h2>
                Choose Items
              </h2>
            </div>
          </div>


          {/* CATEGORIES */}

          <div className="category-list">

            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}

          </div>


          {/* FOOD ITEMS */}

          <div className="food-grid">

            {filteredItems.map((item) => (
              <div
                className="food-card"
                key={item.id}
              >

                <div className="food-image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>


                <div className="food-info">

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    {item.category}
                  </p>

                  <strong>
                    ₹{item.price}
                  </strong>

                </div>


                <button
                  className="add-food"
                  onClick={() =>
                    addToCart(item)
                  }
                >
                  + Add
                </button>

              </div>
            ))}

          </div>

        </section>


        {/* CART */}

        <section className="cart-section">

          <div className="cart-header">

            <div>
              <p className="billing-label">
                CURRENT ORDER
              </p>

              <h2>
                Order Cart
              </h2>
            </div>

            <span className="cart-count">
              {cart.length} items
            </span>

          </div>


          {/* CART ITEMS */}

          <div className="cart-items">

            {cart.length === 0 ? (

              <div className="empty-cart">

                <div className="cart-symbol">
                  Cart
                </div>

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add food items from the menu.
                </p>

              </div>

            ) : (

              cart.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  <div className="cart-item-info">

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      ₹{item.price}
                    </span>

                  </div>


                  <div className="quantity-control">

                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>


          {/* BILL SUMMARY */}

          <div className="bill-summary">

            <div>
              <span>
                Subtotal
              </span>

              <strong>
                ₹{subtotal.toFixed(2)}
              </strong>
            </div>


            <div>
              <span>
                GST (5%)
              </span>

              <strong>
                ₹{tax.toFixed(2)}
              </strong>
            </div>


            <div className="grand-total">

              <span>
                Total
              </span>

              <strong>
                ₹{total.toFixed(2)}
              </strong>

            </div>

          </div>


          {/* PAYMENT */}

          <div className="payment-section">

            <p>
              Payment Method
            </p>

            <div className="payment-buttons">

              <button
                className={
                  payment === "Cash"
                    ? "payment-button active"
                    : "payment-button"
                }
                onClick={() =>
                  setPayment("Cash")
                }
              >
                Cash
              </button>


              <button
                className={
                  payment === "Card"
                    ? "payment-button active"
                    : "payment-button"
                }
                onClick={() =>
                  setPayment("Card")
                }
              >
                Card
              </button>


              <button
                className={
                  payment === "UPI"
                    ? "payment-button active"
                    : "payment-button"
                }
                onClick={() =>
                  setPayment("UPI")
                }
              >
                UPI
              </button>

            </div>

          </div>


          {/* GENERATE BILL */}

          <button
            className="generate-bill"
            onClick={generateBill}
          >
            Generate Bill
          </button>

        </section>

      </div>

    </div>
  );
}

export default Billing;