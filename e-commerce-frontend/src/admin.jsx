import { useEffect, useState } from "react";
import "./admin.css";
import Navbar from "./Navbar";
import { toast } from "react-hot-toast";
import api from "./api";

function Admin() {
  const [title, setTitle] = useState("");
  const [asin, setAsin] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [productURL, setProductURL] = useState("");
  const [price, setPrice] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [stars, setStars] = useState("");
  const [reviews, setReviews] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [boughtInLastMonth, setBoughtInLastMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProductCount(response.data.products?.length ?? 0);
    } catch (error) { console.log(error); }
  };

  const fetchUserCount = async () => {
    try {
      const response = await api.get("/users");
      setUserCount(response.data.users?.length ?? 0);
    } catch (error) { console.log(error); }
  };

  useEffect(() => { fetchProducts(); fetchUserCount(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/products", {
        title, asin, imgUrl, productURL,
        price: parseFloat(price),
        listPrice: parseFloat(listPrice) || undefined,
        stars: parseFloat(stars) || undefined,
        reviews: parseInt(reviews) || undefined,
        category_id: parseInt(categoryId) || undefined,
        isBestSeller,
        boughtInLastMonth: parseInt(boughtInLastMonth) || undefined,
      });
      toast.success("Product added successfully!");
      setTitle(""); setAsin(""); setImgUrl(""); setProductURL("");
      setPrice(""); setListPrice(""); setStars(""); setReviews("");
      setCategoryId(""); setIsBestSeller(false); setBoughtInLastMonth("");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to add product. Check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-inner">
        <h1 className="admin-title">Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <p className="stat-label">Total Products</p>
            <div className="stat-count">{productCount}</div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Users</p>
            <div className="stat-count">{userCount}</div>
          </div>
        </div>
        <div className="admin-card">
          <h2>Add New Product</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-row">
              <div className="admin-field"><label>Title *</label><input type="text" placeholder="Product title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
              <div className="admin-field"><label>ASIN</label><input type="text" placeholder="e.g. B08XYZ123" value={asin} onChange={(e) => setAsin(e.target.value)} /></div>
            </div>
            <div className="admin-form-row">
              <div className="admin-field"><label>Price (₹) *</label><input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
              <div className="admin-field"><label>List Price (₹)</label><input type="number" placeholder="Original price" value={listPrice} onChange={(e) => setListPrice(e.target.value)} /></div>
            </div>
            <div className="admin-form-row">
              <div className="admin-field"><label>Stars (0–5)</label><input type="number" step="0.1" min="0" max="5" placeholder="4.5" value={stars} onChange={(e) => setStars(e.target.value)} /></div>
              <div className="admin-field"><label>Reviews</label><input type="number" placeholder="Number of reviews" value={reviews} onChange={(e) => setReviews(e.target.value)} /></div>
            </div>
            <div className="admin-form-row">
              <div className="admin-field"><label>Category ID</label><input type="number" placeholder="Category ID" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} /></div>
              <div className="admin-field"><label>Bought Last Month</label><input type="number" placeholder="e.g. 500" value={boughtInLastMonth} onChange={(e) => setBoughtInLastMonth(e.target.value)} /></div>
            </div>
            <div className="admin-field"><label>Image URL</label><input type="text" placeholder="https://..." value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} /></div>
            <div className="admin-field"><label>Product URL</label><input type="text" placeholder="https://amazon.com/..." value={productURL} onChange={(e) => setProductURL(e.target.value)} /></div>
            <div className="admin-checkbox-row">
              <input type="checkbox" id="bestSeller" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} />
              <label htmlFor="bestSeller">Mark as Best Seller</label>
            </div>
            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? "Adding…" : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admin;