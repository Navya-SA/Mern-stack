import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./App.css";

import Home from "./Home";
import Profile from "./profile";
import Product from "./Product";
import RegisterForm from "./RegisterForm";
import Admin from "./admin";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/users/login",
        {
          email,
          password,
        }
      );

      console.log(response.data);

      localStorage.setItem("_id", response.data.user._id);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("email", response.data.user.email);

      alert("Login Successful");

      navigate("/home");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message || "Login Failed"
      );
    }
  };

  const handleRegister = () => {
    navigate("/RegisterForm");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="logo">E-Commerce</h1>

        <p className="subtitle">
          Sign in to access your account
        </p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="primary-btn">
            Sign In
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <p className="register-text">
          Don't have an account?
        </p>

        <button
          type="button"
          className="secondary-btn"
          onClick={handleRegister}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

function App() {
  const username = localStorage.getItem("username") || "Guest";

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home username={username} />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/product" element={<Product />} />
      <Route path="/RegisterForm" element={<RegisterForm />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;