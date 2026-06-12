import { useEffect, useState, useCallback } from "react";
import api from "./api";
import "./Product.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { addToCart } from "./cartUtils";
import { useCart } from "./CartContext";
import { addWishlist, removeWishlist } from "./wishlistUtils";
import StarRating from "./StarRating";
import { formatPrice } from "./currency";
import { useDebounce } from "./useDebounce";

const PAGE_SIZE = 12;

function Product() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState({});
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const userId = localStorage.getItem("_id");
  const { refreshCart } = useCart();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [onlyBestSeller, setOnlyBestSeller] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, onlyBestSeller, sortBy, selectedCategory]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: PAGE_SIZE,
      });
      if (debouncedSearch.trim())  params.set("search", debouncedSearch.trim());
      if (onlyBestSeller)          params.set("bestSeller", "true");
      if (sortBy !== "default")    params.set("sort", sortBy);
      if (selectedCategory != null) params.set("category", selectedCategory);

      const response = await api.get(`/products?${params}`);
      setProducts(response.data.products);
      setTotal(response.data.total);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, onlyBestSeller, sortBy, selectedCategory]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    if (!userId) return;
    import('./wishlistUtils').then(({ fetchWishlist }) => {
      fetchWishlist(userId).then(items => {
        const map = {};
        items.forEach(i => { if (i.productId?._id) map[i.productId._id] = true; });
        setWishlisted(map);
      }).catch(() => {});
    });
  }, []);

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    try {
      setAddingToCart(prev => ({ ...prev, [product._id]: true }));
      await addToCart(userId, product._id);
      await refreshCart();
      toast.success("Added to cart", { icon: "🛒" });
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const handleWishlist = async (e, product) => {
    e.stopPropagation();
    const id = product._id;
    try {
      if (wishlisted[id]) {
        await removeWishlist(userId, id);
        setWishlisted(prev => ({ ...prev, [id]: false }));
        toast("Removed from wishlist", { icon: "💔" });
      } else {
        await addWishlist(userId, id);
        setWishlisted(prev => ({ ...prev, [id]: true }));
        toast.success("Added to wishlist", { icon: "❤️" });
      }
    } catch {
      toast.error("Wishlist update failed");
    }
  };

  const handleBuyNow = async (e, product) => {
    e.stopPropagation();
    try {
      await addToCart(userId, product._id);
      await refreshCart();
      toast.success("Ready for checkout!");
      navigate("/cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const clearAll = () => {
    setSearch("");
    setOnlyBestSeller(false);
    setSortBy("default");
    setSelectedCategory(null);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <Navbar />
      <div className="product-page">
        <div className="product-page-header">
          <h1>Products</h1>
          <div className="product-toolbar">
            <div className="product-search-wrap">
              <svg className="search-icon" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="product-search"
                type="text"
                placeholder="Search by title or ASIN…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch("")}>✕</button>
              )}
            </div>
            <div className="product-toolbar-controls">
              <select className="product-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Sort: Default</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="stars">Top Rated</option>
              </select>
              <button
                className={`product-filter-btn ${onlyBestSeller ? "active" : ""}`}
                onClick={() => setOnlyBestSeller(v => !v)}
              >
                ⭐ Best Sellers
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="product-skeleton-grid">
            {[...Array(8)].map((_, i) => (
              <div className="product-skeleton" key={i}>
                <div className="ps-img" />
                <div className="ps-lines">
                  <div className="ps-line long" />
                  <div className="ps-line mid" />
                  <div className="ps-line short" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="product-empty">
            <div className="product-empty-icon">🔍</div>
            <h2>No products found</h2>
            <p>Try a different search or clear the filters.</p>
            <button className="product-clear-btn" onClick={clearAll}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="product-count">{total} product{total !== 1 ? "s" : ""} · Page {page} of {totalPages}</p>
            <div className="product-container">
              {products.map((product) => (
                <div
                  className="product-card"
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {product.isBestSeller && <span className="product-badge">Best Seller</span>}

                  <button
                    className={`wishlist-btn ${wishlisted[product._id] ? "wishlisted" : ""}`}
                    onClick={(e) => handleWishlist(e, product)}
                    aria-label={wishlisted[product._id] ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18"
                      fill={wishlisted[product._id] ? "currentColor" : "none"}
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  {product.imgUrl && (
                    <div className="product-img-wrap">
                      <img src={product.imgUrl} alt={product.title} className="product-img"
                        onError={(e) => (e.target.style.display = "none")} />
                    </div>
                  )}
                  <div className="product-body">
                    <h2 className="product-title" title={product.title}>
                      {product.title || "Untitled Product"}
                    </h2>
                    {product.asin && <p className="product-asin">ASIN: {product.asin}</p>}
                    <div className="product-rating-row">
                      <StarRating stars={product.stars} size={13} />
                      {product.reviews != null && (
                        <span className="product-reviews">({product.reviews.toLocaleString()} reviews)</span>
                      )}
                    </div>
                    <div className="product-price-row">
                      <span className="product-price">{formatPrice(product.price)}</span>
                      {product.listPrice > product.price && (
                        <span className="product-list-price">{formatPrice(product.listPrice)}</span>
                      )}
                      {product.listPrice > product.price && (
                        <span className="product-discount">
                          {Math.round(((product.listPrice - product.price) / product.listPrice) * 100)}% off
                        </span>
                      )}
                    </div>
                    {product.boughtInLastMonth != null && (
                      <p className="product-bought">🔥 {product.boughtInLastMonth.toLocaleString()}+ bought last month</p>
                    )}
                  </div>

                  <div className="product-btn-row">
                    <button
                      className="cart-add-btn"
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={addingToCart[product._id]}
                    >
                      {addingToCart[product._id] ? "Adding…" : "Add to Cart"}
                    </button>
                    <button className="buy-btn" onClick={(e) => handleBuyNow(e, product)}>
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
                {[...Array(totalPages)].map((_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2))
                  .map(p => (
                    <button key={p} className={`page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Product;