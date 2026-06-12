import { useState } from "react";
import "./RegisterForm.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "./api";

function RegisterForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/users", {
        username, password, PhoneNo, email, address,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("_id", user._id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);
      toast.success("Account created! Welcome aboard 🎉");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="orb-1" /><div className="orb-2" /><div className="orb-3" /><div className="orb-4" />
      <div className="register-card">
        <div className="register-logo-row">
          <div className="register-logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <span className="register-logo">The Whim Shop</span>
        </div>
        <p className="register-subtitle">Create your account to get started</p>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="register-form-group">
            <label className="register-form-label">Username</label>
            <div className="register-input-wrap">
              <svg className="input-icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              <input className="register-form-input" type="text" placeholder="johndoe" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Email</label>
            <div className="register-input-wrap">
              <svg className="input-icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
              <input className="register-form-input" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Phone Number</label>
            <div className="register-input-wrap">
              <svg className="input-icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18a2 2 0 012-2.18h3a2 2 0 012 1.72c.13 1 .38 1.97.72 2.91a2 2 0 01-.45 2.11L6.09 6.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.94.34 1.91.59 2.91.72a2 2 0 011.72 2.01z"/></svg>
              <input className="register-form-input" type="text" placeholder="+91 98765 43210" value={PhoneNo} onChange={(e) => setPhoneNo(e.target.value)} required />
            </div>
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Address</label>
            <div className="register-input-wrap">
              <svg className="input-icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <input className="register-form-input" type="text" placeholder="123 Main St, City" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
          </div>

          <div className="register-form-group full-width">
            <label className="register-form-label">Password</label>
            <div className="register-input-wrap">
              <svg className="input-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input className="register-form-input" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="pw-toggle" onClick={() => setShowPassword((p) => !p)}>
                {showPassword
                  ? <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <button className="register-form-button" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <div className="back-to-login">
            <Link to="/">Already have an account? <span>Sign in</span></Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;