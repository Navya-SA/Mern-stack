import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "./api";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState("loading"); // "loading" | "admin" | "denied"

  useEffect(() => {
    if (!token) { setStatus("denied"); return; }

    api.get("/users/me")
      .then((res) => {
        setStatus(res.data.user?.isAdmin === true ? "admin" : "denied");
      })
      .catch(() => setStatus("denied"));
  }, [token]);

  if (status === "loading") {
    return (
      <div style={{
        minHeight: "100vh", background: "#0D0D0D", display: "flex",
        alignItems: "center", justifyContent: "center",
        color: "rgba(200,168,130,0.5)", fontFamily: "'Inter', sans-serif", fontSize: "15px"
      }}>
        Verifying access…
      </div>
    );
  }

  if (status === "denied") return <Navigate to="/home" replace />;
  return children;
}

export default AdminRoute;