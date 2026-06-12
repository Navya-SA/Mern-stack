import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import "./App.css";
import api from "./api";

// Route Guards
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// Page Components
import Home from "./Home";
import Profile from "./profile";
import Product from "./Product";
import RegisterForm from "./RegisterForm";
import Admin from "./admin";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";
import { CartProvider } from "./CartContext";


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem("token")) {
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/users/login", { email, password });
      const { token, user } = response.data;

      // Store JWT — never store isAdmin in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("_id", user._id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);

      toast.success("Welcome back, " + user.username + "!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => navigate("/RegisterForm");

  return (
    <div className="auth-page">
      <div className="orb-1" />
      <div className="orb-2" />
      <div className="orb-3" />
      <div className="orb-4" />

      <div className="auth-card">
        <div className="logo-row">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h1 className="logo">The Whim Shop</h1>
        </div>

        <p className="subtitle">Sign in to access your account</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-wrap">
            <svg className="input-icon" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-wrap pw-wrap">
            <svg className="input-icon" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="forgot-row">
            <button type="button" className="forgot-link">Forgot password?</button>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="divider"><span>OR</span></div>

        <p className="register-text">Don't have an account?</p>
        <button type="button" className="secondary-btn" onClick={handleRegister}>
          Create Account
        </button>
      </div>
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh", background: "#0D0D0D", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif", color: "#fff", gap: "16px"
    }}>
      <div style={{ fontSize: "72px" }}>404</div>
      <p style={{ color: "rgba(200,168,130,0.55)", fontSize: "16px" }}>Page not found</p>
      <button onClick={() => navigate("/home")} style={{
        padding: "12px 28px", border: "none", borderRadius: "10px",
        background: "linear-gradient(135deg, #FF4500, #CC3300)",
        color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer",
        fontFamily: "inherit"
      }}>Go Home</button>
    </div>
  );
}

function App() {
  const username = localStorage.getItem("username") || "Guest";
  return (
    <CartProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid rgba(255,69,0,0.25)",
            borderRadius: "10px",
            fontSize: "14px",
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          },
          success: { iconTheme: { primary: "#FF4500", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />

        <Route path="/home" element={<PrivateRoute><Home username={username} /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/product" element={<PrivateRoute><Product /></PrivateRoute>} />
        <Route path="/product/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </CartProvider>
  );
}

export default App;