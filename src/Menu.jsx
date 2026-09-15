import { useState } from "react";

import chickenBiryani from "./assets/chicken-biryani.jpg";
import vegBiryani from "./assets/veg-biryani.jpg";
import friedRice from "./assets/fried-rice.jpg";
import paneer from "./assets/paneer.jpg";
import dosa from "./assets/dosa.jpg";
import idli from "./assets/idli.jpg";
import limeJuice from "./assets/lime-juice.jpg";
import coldCoffee from "./assets/cold-coffee.jpg";

function Menu({ goBack }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [items, setItems] = useState([
    {
      id: 1,
      name: "Chicken Biryani",
      category: "Main Course",
      price: 220,
      image: chickenBiryani,
      available: true,
    },
    {
      id: 2,
      name: "Veg Biryani",
      category: "Main Course",
      price: 180,
      image: vegBiryani,
      available: true,
    },
    {
      id: 3,
      name: "Chicken Fried Rice",
      category: "Rice",
      price: 190,
      image: friedRice,
      available: true,
    },
    {
      id: 4,
      name: "Paneer Butter Masala",
      category: "Main Course",
      price: 210,
      image: paneer,
      available: true,
    },
    {
      id: 5,
      name: "Masala Dosa",
      category: "Breakfast",
      price: 90,
      image: dosa,
      available: true,
    },
    {
      id: 6,
      name: "Idli",
      category: "Breakfast",
      price: 60,
      image: idli,
      available: true,
    },
    {
      id: 7,
      name: "Fresh Lime Juice",
      category: "Drinks",
      price: 70,
      image: limeJuice,
      available: true,
    },
    {
      id: 8,
      name: "Cold Coffee",
      category: "Drinks",
      price: 120,
      image: coldCoffee,
      available: true,
    },
  ]);

  const categories = [
    "All",
    "Main Course",
    "Rice",
    "Breakfast",
    "Drinks",
  ];

  const filteredItems = items.filter((item) => {
    const categoryMatch =
      category === "All" || item.category === category;

    const searchMatch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const toggleAvailability = (id) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              available: !item.available,
            }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    const confirmDelete = window.confirm(
      "Do you want to delete this item?"
    );

    if (confirmDelete) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="menu-page">

      {/* HEADER */}

      <div className="menu-topbar">

        <div>
          <p className="menu-label">
            RESTAURANT MENU
          </p>

          <h1>
            Menu Management
          </h1>

          <p className="menu-subtitle">
            Manage your restaurant food items and availability.
          </p>
        </div>

        <button
          className="menu-back-button"
          onClick={goBack}
        >
          ← Dashboard
        </button>

      </div>


      {/* SEARCH */}

      <div className="menu-tools">

        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="menu-search"
          
        />

      </div>


      {/* CATEGORIES */}

      <div className="menu-categories">

        {categories.map((item) => (
          <button
            key={item}
            className={
              category === item
                ? "menu-category active"
                : "menu-category"
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

      <div className="menu-grid">

        {filteredItems.map((item) => (

          <div
            className="menu-food-card"
            key={item.id}
          >

            {/* IMAGE */}

            <div className="menu-food-image">
              <img
                src={item.image}
                alt={item.name}
              />

              <span
                className={
                  item.available
                    ? "availability available"
                    : "availability unavailable"
                }
              >
                {item.available
                  ? "Available"
                  : "Unavailable"}
              </span>
            </div>


            {/* DETAILS */}

            <div className="menu-food-details">

              <p className="food-category">
                {item.category}
              </p>

              <h2>
                {item.name}
              </h2>

              <strong>
                ₹{item.price}
              </strong>

            </div>


            {/* ACTIONS */}

            <div className="menu-actions">

              <button
                className="availability-button"
                onClick={() =>
                  toggleAvailability(item.id)
                }
              >
                {item.available
                  ? "Mark Unavailable"
                  : "Mark Available"}
              </button>

              <button
                className="delete-button"
                onClick={() =>
                  deleteItem(item.id)
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>


      {/* NO RESULTS */}

      {filteredItems.length === 0 && (
        <div className="no-menu-items">
          <h2>
            No food items found
          </h2>

          <p>
            Try another food name or category.
          </p>
        </div>
      )}

    </div>
  );
}

export default Menu;