import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "./Navbar";
import "./Cart.css";
import { fetchCart, updateQty, removeFromCart, clearCart } from "./cartUtils";
import api from "./api";

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p className="modal-msg">{message}</p>
        <div className="modal-actions">
          <button className="modal-confirm-btn" onClick={onConfirm}>Yes, proceed</button>
          <button className="modal-cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const userId = localStorage.getItem("_id");

  const loadCart = async () => {
    try {
      const items = await fetchCart(userId);
      setCartItems(items);
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const handleQty = async (productId, delta) => {
    const item = cartItems.find(i => i.productId._id === productId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) return handleRemove(productId);
    try {
      await updateQty(userId, productId, newQty);
      setCartItems(prev =>
        prev.map(i => i.productId._id === productId ? { ...i, quantity: newQty } : i)
      );
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(userId, productId);
      setCartItems(prev => prev.filter(i => i.productId._id !== productId));
      toast("Item removed from cart", { icon: "🗑️" });
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleClear = async () => {
    try {
      await clearCart(userId);
      setCartItems([]);
      toast("Cart cleared");
    } catch (err) {
      toast.error("Failed to clear cart");
    } finally {
      setShowClearModal(false);
    }
  };

  const subtotal = cartItems.reduce((sum, i) => sum + (i.productId.price * i.quantity), 0);
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handlePlaceOrder = async () => {
    setShowOrderModal(false);
    setPlacing(true);
    try {
      await Promise.all(
        cartItems.map(i =>
          api.post("/orders", {
            userId,
            productId: i.productId._id,
            quantity: i.quantity,
          })
        )
      );
      await clearCart(userId);
      setCartItems([]);
      toast.success(`Order placed! ${itemCount} item${itemCount > 1 ? "s" : ""} confirmed.`);
      navigate("/home");
    } catch (err) {
      toast.error("Order failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="cart-page">
      <Navbar cartCount={itemCount} />

      {showOrderModal && (
        <ConfirmModal
          message={`Place order for ${itemCount} item${itemCount > 1 ? "s" : ""} ($${subtotal.toLocaleString()})?`}
          onConfirm={handlePlaceOrder}
          onCancel={() => setShowOrderModal(false)}
        />
      )}
      {showClearModal && (
        <ConfirmModal
          message="Clear all items from your cart?"
          onConfirm={handleClear}
          onCancel={() => setShowClearModal(false)}
        />
      )}

      <div className="cart-inner">
        <h1 className="cart-title">Your Cart</h1>

        {loading ? (
          <div className="cart-empty"><div className="cart-empty-icon">⏳</div><h2>Loading cart…</h2></div>
        ) : cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started.</p>
            <button className="cart-shop-btn" onClick={() => navigate("/product")}>
              Browse Products →
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item) => {
                const p = item.productId;
                return (
                  <div className="cart-item" key={p._id}>
                    {p.imgUrl ? (
                      <img src={p.imgUrl} alt={p.title} className="cart-item-img"
                        onError={(e) => (e.target.style.display = "none")} />
                    ) : (
                      <div className="cart-item-img-placeholder">📦</div>
                    )}
                    <div className="cart-item-body">
                      <p className="cart-item-title">{p.title}</p>
                      <span className="cart-item-price">
                        ${(p.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    <div className="cart-item-right">
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => handleQty(p._id, -1)}>−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => handleQty(p._id, 1)}>+</button>
                      </div>
                      <button className="cart-remove-btn" onClick={() => handleRemove(p._id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Items ({itemCount})</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span style={{ color: "#4ade80" }}>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <button className="cart-order-btn" onClick={() => setShowOrderModal(true)} disabled={placing}>
                {placing ? "Placing Order…" : "Place Order"}
              </button>
              <button className="cart-clear-btn" onClick={() => setShowClearModal(true)}>Clear Cart</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;