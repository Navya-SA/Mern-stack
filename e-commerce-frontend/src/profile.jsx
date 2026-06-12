import "./profile.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { fetchWishlist, removeWishlist } from "./wishlistUtils";
import { addToCart } from "./cartUtils";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { useCart } from "./CartContext";

function ConfirmModal({ message, onConfirm, onCancel, danger }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p className="modal-msg">{message}</p>
        <div className="modal-actions">
          <button className={danger ? "modal-danger-btn" : "modal-confirm-btn"} onClick={onConfirm}>
            {danger ? "Yes, delete" : "Yes, proceed"}
          </button>
          <button className="modal-cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  Pending:   { color: "#facc15", bg: "rgba(250,204,21,0.10)",  border: "rgba(250,204,21,0.25)" },
  Shipped:   { color: "#60a5fa", bg: "rgba(96,165,250,0.10)",  border: "rgba(96,165,250,0.25)" },
  Delivered: { color: "#4ade80", bg: "rgba(74,222,128,0.10)",  border: "rgba(74,222,128,0.20)" },
  Cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.10)", border: "rgba(248,113,113,0.20)" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS["Pending"];
  return (
    <span style={{
      fontSize: "11px", fontWeight: 600, color: s.color,
      background: s.bg, border: `1px solid ${s.border}`,
      padding: "3px 9px", borderRadius: "20px", letterSpacing: "0.3px"
    }}>{status}</span>
  );
}

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  const [pwData, setPwData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [showPwFields, setShowPwFields] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const userId = localStorage.getItem("_id");
  const { refreshCart } = useCart();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data.user);
        setEditData({
          username: res.data.user.username,
          email: res.data.user.email,
          PhoneNo: res.data.user.PhoneNo,
          address: res.data.user.address,
        });
      } catch (err) { console.log(err); }
    };

    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders/user/${userId}`);
        setOrders(res.data.orders);
      } catch (err) { console.log(err); }
      finally { setOrdersLoading(false); }
    };

    const loadWishlist = async () => {
      try {
        const items = await fetchWishlist(userId);
        setWishlist(items);
      } catch (err) { console.log(err); }
      finally { setWishlistLoading(false); }
    };

    fetchUser();
    fetchOrders();
    loadWishlist();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch(`/users/${userId}`, editData);
      setUser(res.data.user);
      localStorage.setItem("username", res.data.user.username);
      setEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwData.currentPassword || !pwData.newPassword || !pwData.confirmPassword) {
      return toast.error("Fill in all password fields.");
    }
    if (pwData.newPassword !== pwData.confirmPassword) {
      return toast.error("New passwords don't match.");
    }
    if (pwData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    setPwSaving(true);
    try {
      await api.patch(`/users/${userId}/password`, {
        currentPassword: pwData.currentPassword,
        newPassword: pwData.newPassword,
      });
      toast.success("Password changed!");
      setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPwFields(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPwSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/users/${userId}`);
      localStorage.clear();
      toast.success("Account deleted.");
      navigate("/");
    } catch (err) {
      toast.error("Failed to delete account.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      await removeWishlist(userId, productId);
      setWishlist((prev) => prev.filter((w) => w.productId?._id !== productId));
      toast("Removed from wishlist", { icon: "💔" });
    } catch (err) {
      toast.error("Failed to remove.");
    }
  };

  const handleWishlistToCart = async (product) => {
    try {
      await addToCart(userId, product._id);
      await refreshCart();
      toast.success("Added to cart!", { icon: "🛒" });
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-loading">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />

      {showDeleteModal && (
        <ConfirmModal
          message="Are you sure you want to delete your account? This cannot be undone."
          danger
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div className="profile-inner">
        <div className="profile-hero">
          <div className="profile-avatar">{user.username?.charAt(0).toUpperCase()}</div>
          <div className="profile-hero-info">
            <h1 className="profile-username">{user.username}</h1>
            <span className="profile-role">Customer Account</span>
          </div>
          {!editing && (
            <button className="profile-edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>

        {editing && (
          <div className="profile-edit-card">
            <h2 className="edit-card-title">Edit Profile</h2>
            <div className="edit-grid">
              <div className="edit-field">
                <label>Username</label>
                <input value={editData.username} onChange={(e) => setEditData({ ...editData, username: e.target.value })} />
              </div>
              <div className="edit-field">
                <label>Email</label>
                <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
              </div>
              <div className="edit-field">
                <label>Phone</label>
                <input value={editData.PhoneNo} onChange={(e) => setEditData({ ...editData, PhoneNo: e.target.value })} />
              </div>
              <div className="edit-field full">
                <label>Address</label>
                <input value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
              </div>
            </div>
            <div className="edit-actions">
              <button className="edit-save-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
              <button className="edit-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="profile-tabs">
          {["details", "orders", "wishlist", "security"].map(tab => (
            <button
              key={tab}
              className={`profile-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "details" && "Details"}
              {tab === "orders" && <>Order History {orders.length > 0 && <span className="tab-badge">{orders.length}</span>}</>}
              {tab === "wishlist" && <>Wishlist {wishlist.length > 0 && <span className="tab-badge">{wishlist.length}</span>}</>}
              {tab === "security" && "Security"}
            </button>
          ))}
        </div>

        {activeTab === "details" && (
          <div className="profile-card">
            {[
              { label: "Email", value: user.email },
              { label: "Phone", value: user.PhoneNo },
              { label: "Address", value: user.address },
            ].map(({ label, value }) => (
              <div className="detail-item" key={label}>
                <label>{label}</label>
                <p>{value || "—"}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-section">
            {ordersLoading ? (
              <div className="orders-skeleton">
                {[...Array(3)].map((_, i) => (
                  <div className="order-skeleton" key={i}>
                    <div className="os-img" /><div className="os-lines">
                      <div className="os-line long" /><div className="os-line mid" />
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="orders-empty">
                <div className="orders-empty-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Your order history will appear here once you make a purchase.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => {
                  const p = order.productId;
                  return (
                    <div className="order-item" key={order._id}>
                      {p?.imgUrl ? (
                        <img src={p.imgUrl} alt={p?.title} className="order-img"
                          onError={(e) => (e.target.style.display = "none")} />
                      ) : (
                        <div className="order-img-placeholder">📦</div>
                      )}
                      <div className="order-body">
                        <p className="order-title">{p?.title || "Product unavailable"}</p>
                        <p className="order-date">
                          Ordered on{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                          {order.quantity > 1 && <span className="order-qty"> · Qty: {order.quantity}</span>}
                        </p>
                      </div>
                      <div className="order-right">
                        {p?.price != null && (
                          <span className="order-price">${(p.price * (order.quantity || 1)).toLocaleString()}</span>
                        )}
                        <StatusBadge status={order.status || "Pending"} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="orders-section">
            {wishlistLoading ? (
              <div className="orders-skeleton">
                {[...Array(3)].map((_, i) => (
                  <div className="order-skeleton" key={i}>
                    <div className="os-img" /><div className="os-lines">
                      <div className="os-line long" /><div className="os-line mid" />
                    </div>
                  </div>
                ))}
              </div>
            ) : wishlist.length === 0 ? (
              <div className="orders-empty">
                <div className="orders-empty-icon">🤍</div>
                <h3>Your wishlist is empty</h3>
                <p>Heart products you love and find them here.</p>
                <button className="wl-shop-btn" onClick={() => navigate("/product")}>Browse Products →</button>
              </div>
            ) : (
              <div className="orders-list">
                {wishlist.map((item) => {
                  const p = item.productId;
                  return (
                    <div className="order-item" key={item._id}>
                      {p?.imgUrl ? (
                        <img src={p.imgUrl} alt={p?.title} className="order-img"
                          onError={(e) => (e.target.style.display = "none")} />
                      ) : (
                        <div className="order-img-placeholder">🛍️</div>
                      )}
                      <div className="order-body">
                        <p className="order-title" style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/product/${p?._id}`)}>
                          {p?.title || "Product unavailable"}
                        </p>
                        {p?.price != null && (
                          <p className="order-date" style={{ color: "#FF7733", fontWeight: 600 }}>
                            ${p.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="order-right">
                        <button className="wl-cart-btn" onClick={() => p && handleWishlistToCart(p)}>Add to Cart</button>
                        <button className="wl-remove-btn" onClick={() => handleRemoveWishlist(p?._id)}>Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="security-section">
            <div className="security-card">
              <div className="security-card-header">
                <div>
                  <h3 className="security-card-title">Change Password</h3>
                  <p className="security-card-sub">Update your account password</p>
                </div>
                {!showPwFields && (
                  <button className="profile-edit-btn" onClick={() => setShowPwFields(true)}>Change</button>
                )}
              </div>
              {showPwFields && (
                <div className="pw-fields">
                  <div className="edit-field">
                    <label>Current Password</label>
                    <input type="password" placeholder="••••••••"
                      value={pwData.currentPassword}
                      onChange={(e) => setPwData({ ...pwData, currentPassword: e.target.value })} />
                  </div>
                  <div className="edit-field">
                    <label>New Password</label>
                    <input type="password" placeholder="••••••••"
                      value={pwData.newPassword}
                      onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })} />
                  </div>
                  <div className="edit-field">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="••••••••"
                      value={pwData.confirmPassword}
                      onChange={(e) => setPwData({ ...pwData, confirmPassword: e.target.value })} />
                  </div>
                  <div className="edit-actions" style={{ marginTop: "4px" }}>
                    <button className="edit-save-btn" onClick={handleChangePassword} disabled={pwSaving}>
                      {pwSaving ? "Saving…" : "Update Password"}
                    </button>
                    <button className="edit-cancel-btn" onClick={() => { setShowPwFields(false); setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="security-card danger-card">
              <div className="security-card-header">
                <div>
                  <h3 className="security-card-title danger-title">Delete Account</h3>
                  <p className="security-card-sub">Permanently delete your account and all data. This cannot be undone.</p>
                </div>
                <button className="delete-account-btn" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;