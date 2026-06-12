import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { toast } from "react-hot-toast";
import { useCart } from "./CartContext";

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Account";
  const { cartCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
    setDrawerOpen(false);
  };

  const go = (path) => { navigate(path); setDrawerOpen(false); };

  return (
    <>
      <nav className="navbar">
        <button className="nav-logo" onClick={() => go("/home")}>
          <svg viewBox="0 0 24 24" className="nav-logo-icon">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          The Whim Shop
        </button>

        {/* Desktop nav */}
        <div className="nav-right nav-desktop">
          <button onClick={() => go("/product")} className="nav-button">Products</button>

          <button onClick={() => go("/cart")} className="nav-button nav-button--cart">
            <span className="nav-cart-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <span className="nav-cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </span>
            Cart
          </button>

          <button onClick={() => go("/profile")} className="nav-button nav-button--user">
            <span className="nav-avatar">{username.charAt(0).toUpperCase()}</span>
            {username}
          </button>
          <button onClick={handleLogout} className="nav-button nav-button--logout">Logout</button>
        </div>

        {/* Mobile: cart badge + hamburger */}
        <div className="nav-right nav-mobile">
          <button onClick={() => go("/cart")} className="nav-button nav-button--cart">
            <span className="nav-cart-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <span className="nav-cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </span>
          </button>
          <button
            className="nav-hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="nav-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="nav-drawer-header">
              <span className="nav-drawer-logo">The Whim Shop</span>
              <button className="nav-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="nav-drawer-user">
              <span className="nav-avatar nav-avatar--lg">{username.charAt(0).toUpperCase()}</span>
              <span className="nav-drawer-username">{username}</span>
            </div>
            <nav className="nav-drawer-links">
              <button onClick={() => go("/home")} className="nav-drawer-link">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Home
              </button>
              <button onClick={() => go("/product")} className="nav-drawer-link">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                Products
              </button>
              <button onClick={() => go("/cart")} className="nav-drawer-link">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
                Cart
                {cartCount > 0 && <span className="nav-drawer-badge">{cartCount > 99 ? "99+" : cartCount}</span>}
              </button>
              <button onClick={() => go("/profile")} className="nav-drawer-link">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Profile
              </button>
            </nav>
            <button onClick={handleLogout} className="nav-drawer-logout">Logout</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;