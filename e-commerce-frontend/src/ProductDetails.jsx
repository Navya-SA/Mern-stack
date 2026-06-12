import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api";
import "./ProductDetails.css";
import Navbar from "./Navbar";
import { toast } from "react-hot-toast";
import { addToCart } from "./cartUtils";
import { useCart } from "./CartContext";
import { addWishlist, removeWishlist, checkWishlisted } from "./wishlistUtils";
import StarRating from "./StarRating";
import { formatPrice } from "./currency";

const userId = localStorage.getItem("_id");

function saveRecentlyViewed(id) {
  const userId = localStorage.getItem("_id");
  if (!userId) return;

  const MAX = 6;

  const existing = JSON.parse(
    sessionStorage.getItem(`recentlyViewed_${userId}`) || "[]"
  );

  const filtered = existing.filter((i) => i !== id);

  const updated = [id, ...filtered].slice(0, MAX);

  sessionStorage.setItem(
    `recentlyViewed_${userId}`,
    JSON.stringify(updated)
  );
}
function ProductDetailsSkeleton() {
  return (
    <>
      <Navbar />
      <div className="details-page">
        <div className="details-card">
          <div className="details-skeleton-img" />
          <div className="details-skeleton-info">
            <div className="ds-line w60" />
            <div className="ds-line w90" />
            <div className="ds-line w40" />
            <div className="ds-line w50" />
            <div className="ds-line w30" />
            <div className="ds-btns">
              <div className="ds-btn" /><div className="ds-btn" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [buying, setBuying] = useState(false);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const userId = localStorage.getItem("_id");
  const { refreshCart } = useCart();

  useEffect(() => {
    if (!userId || !id) return;
    checkWishlisted(userId, id).then(setWishlisted).catch(() => {});
  }, [id, userId]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        saveRecentlyViewed(id);
      } catch {
        toast.error("Failed to load product");
        navigate("/product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(userId, id, quantity);
      await refreshCart();
      toast.success("Added to cart!", { icon: "🛒" });
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setBuying(true);
      await addToCart(userId, id, quantity);
      await refreshCart();
      toast.success("Ready for checkout!");
      navigate("/cart");
    } catch {
      toast.error("Failed. Please try again.");
    } finally {
      setBuying(false);
    }
  };

  const handleWishlist = async () => {
    try {
      if (wishlisted) {
        await removeWishlist(userId, id);
        setWishlisted(false);
        toast("Removed from wishlist", { icon: "💔" });
      } else {
        await addWishlist(userId, id);
        setWishlisted(true);
        toast.success("Added to wishlist", { icon: "❤️" });
      }
    } catch {
      toast.error("Wishlist update failed");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product?.product?.title, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return <ProductDetailsSkeleton />;
  if (!product) return null;

  const p = product.product;
  const discount = p.listPrice > p.price
    ? Math.round(((p.listPrice - p.price) / p.listPrice) * 100) : null;

  return (
    <>
      <Navbar />
      <div className="details-page">
        <div className="details-card">
          <div className="details-image">
            {p.imgUrl
              ? <img src={p.imgUrl} alt={p.title} />
              : <div className="details-no-img">No Image</div>}
          </div>
          <div className="details-info">
            {p.isBestSeller && <span className="best-seller">⭐ Best Seller</span>}
            <div className="title-row">
              <h1>{p.title}</h1>
              <div className="title-actions">
                <button
                  className={`wishlist-btn ${wishlisted ? "wishlisted" : ""}`}
                  onClick={handleWishlist}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20"
                    fill={wishlisted ? "currentColor" : "none"}
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <button
                  className="share-btn"
                  onClick={handleShare}
                  aria-label="Share this product"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </button>
              </div>
            </div>
            {p.asin && <p className="details-asin">ASIN: {p.asin}</p>}
            <div className="rating">
              <StarRating stars={p.stars} size={18} />
              {p.reviews != null && <span className="rating-reviews">({p.reviews.toLocaleString()} reviews)</span>}
            </div>
            <div className="price-section">
              <span className="price">{formatPrice(p.price)}</span>
              {p.listPrice > p.price && <span className="list-price">{formatPrice(p.listPrice)}</span>}
              {discount && <span className="discount-badge">{discount}% off</span>}
            </div>
            {p.boughtInLastMonth != null && (
              <p className="bought">🔥 {p.boughtInLastMonth.toLocaleString()}+ bought last month</p>
            )}
            <div className="qty-wrapper">
              <span className="qty-label">Quantity</span>
              <div className="qty-box">
                <button className="qty-btn" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  aria-label="Decrease quantity">−</button>
                <span className="qty-value" aria-live="polite">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(prev => prev + 1)}
                  aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div className="button-group">
              <button className="cart-outline-btn" onClick={handleAddToCart} disabled={adding}>
                {adding ? "Adding…" : "Add to Cart"}
              </button>
              <button className="buy-btn" onClick={handleBuyNow} disabled={buying}>
                {buying ? "Processing…" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;