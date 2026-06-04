import "./profile.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("_id");

      const response = await axios.get(
        `http://localhost:3000/users/${userId}`
      );

      setUser(response.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  fetchUser();
}, []);

  if (!user) {
    return (
      <div>
        <Navbar />
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2>{user.username}</h2>
              <span>Customer Account</span>
            </div>

            <button className="edit-btn">
              Edit Profile
            </button>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>

            <div className="detail-item">
              <label>Phone</label>
              <p>{user.PhoneNo}</p>
            </div>

            <div className="detail-item">
              <label>Address</label>
              <p>{user.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;