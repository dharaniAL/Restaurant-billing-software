import { useState } from "react";

function Setting({ goBack, currentUser }) {
  const [restaurantName, setRestaurantName] = useState("JK Restaurant");
  const [userId, setUserId] = useState(
    currentUser?.username || "admin"
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        alert("Please enter your current password.");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match.");
        return;
      }
    }

    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">

      {/* Header */}
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>
            Manage your restaurant and account preferences
          </p>
        </div>

        <button
          className="settings-back-btn"
          onClick={goBack}
        >
          ← Dashboard
        </button>
      </div>

      {/* Main Settings Area */}
      <div className="settings-container">

        {/* Restaurant Settings */}
        <div className="settings-card">

          <div className="settings-card-header">
            <div className="settings-card-icon">
              R
            </div>

            <div>
              <h2>Restaurant Settings</h2>
              <p>
                Basic information about your restaurant
              </p>
            </div>
          </div>

          <div className="settings-divider"></div>

          <div className="settings-field">
            <label>Restaurant Name</label>

            <input
              type="text"
              value={restaurantName}
              onChange={(e) =>
                setRestaurantName(e.target.value)
              }
              placeholder="Enter restaurant name"
            />
          </div>

          <div className="settings-field">
            <label>Currency</label>

            <input
              type="text"
              value="Indian Rupee (₹)"
              readOnly
            />
          </div>

          <div className="settings-field">
            <label>Country</label>

            <input
              type="text"
              value="India"
              readOnly
            />
          </div>

        </div>

        {/* Account Settings */}
        <div className="settings-card">

          <div className="settings-card-header">
            <div className="settings-card-icon">
              U
            </div>

            <div>
              <h2>Account Settings</h2>
              <p>
                Manage your login and account information
              </p>
            </div>
          </div>

          <div className="settings-divider"></div>

          <div className="settings-field">
            <label>User ID</label>

            <input
              type="text"
              value={userId}
              onChange={(e) =>
                setUserId(e.target.value)
              }
              placeholder="Enter user ID"
            />
          </div>

          <div className="settings-field">
            <label>Current Password</label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              placeholder="Enter current password"
            />
          </div>

          <div className="settings-field">
            <label>New Password</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="Enter new password"
            />
          </div>

          <div className="settings-field">
            <label>Confirm New Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm new password"
            />
          </div>

        </div>

      </div>

      {/* Bottom Actions */}
      <div className="settings-actions">

        <button
          className="settings-cancel-btn"
          onClick={goBack}
        >
          Cancel
        </button><br></br>

        <button
          className="settings-save-btn"
          onClick={handleSave}
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default Setting;