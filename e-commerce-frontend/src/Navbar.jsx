import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button onClick={() => navigate(-1)}className="nav-button">&larr; Back</button>
    <div className="nav-right">
        <button onClick={() => navigate("/home")} className="nav-button">Home</button>
        <button onClick={() => navigate("/product")} className="nav-button">Product List </button>
      </div>
    </nav>
  );
}

export default Navbar;