import "./Home.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import api from "./api";
import { formatPrice } from "./currency";

function Home({ username }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);

  // Fix: verify admin server-side, never trust localStorage
  useEffect(() => {
    api.get("/users/me")
      .then((res) => setIsAdmin(res.data.user?.isAdmin === true))
      .catch(() => setIsAdmin(false));
  }, []);

  // Load recently viewed products from sessionStorage
  const userId = localStorage.getItem("_id");

useEffect(() => {
  if (!userId) return;

  const ids = JSON.parse(
    sessionStorage.getItem(`recentlyViewed_${userId}`) || "[]"
  );

  if (ids.length === 0) return;

  Promise.all(
    ids.map((id) =>
      api
        .get(`/products/${id}`)
        .then((r) => r.data.product)
        .catch(() => null)
    )
  ).then((products) =>
    setRecentProducts(products.filter(Boolean))
  );
}, [userId]);

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-hero">
        <p className="home-eyebrow">Welcome back, {username} 👋</p>
        <h1 className="home-title">The Whim Shop</h1>
        <p className="home-sub">Discover products curated just for you.</p>
        <button className="home-cta" onClick={() => navigate("/product")}>
          Browse Products →
        </button>
      </div>

      <div className="home-cards">
        <div className="home-card" onClick={() => navigate("/product")}>
          <div className="home-card-icon">🛍️</div>
          <h3>Products</h3>
          <p>Explore our full catalogue and find your next purchase.</p>
        </div>

        <div className="home-card" onClick={() => navigate("/profile")}>
          <div className="home-card-icon">👤</div>
          <h3>My Profile</h3>
          <p>View and manage your account details and preferences.</p>
        </div>

        {isAdmin && (
          <div className="home-card" onClick={() => navigate("/admin")}>
            <div className="home-card-icon">⚙️</div>
            <h3>Admin</h3>
            <p>Manage products, view user counts, and control inventory.</p>
          </div>
        )}
      </div>

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <div className="home-recent">
          <h2 className="home-recent-title">Recently Viewed</h2>
          <div className="home-recent-scroll">
            {recentProducts.map((p) => (
              <div
                key={p._id}
                className="home-recent-card"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                {p.imgUrl ? (
                  <img src={p.imgUrl} alt={p.title} className="home-recent-img"
                    onError={(e) => (e.target.style.display = "none")} />
                ) : (
                  <div className="home-recent-img-placeholder">📦</div>
                )}
                <p className="home-recent-name">{p.title}</p>
                <p className="home-recent-price">{formatPrice(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;