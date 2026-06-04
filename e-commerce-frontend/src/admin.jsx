import { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

function Admin() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/products"
      );

      setProductCount(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchUserCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/users"
      );

      setUserCount(response.data.users.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserCount();
  }, []);   
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/products",
        {
          name,
          description,
          price,
          stock,
        }
      );

      alert("Product Added Successfully");

      setName("");
      setDescription("");
      setPrice("");
      setStock("");

      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">
        Admin Dashboard
      </h1>

      <div className="admin-container">
        <div className="admin-card">
          <h2>Add Product</h2>
          <form onSubmit={handleSubmit}>
            <input type="text"placeholder="Product Name"value={name} onChange={(e) =>setName(e.target.value)}/>
            <textarea placeholder="Description"value={description}onChange={(e) => setDescription(e.target.value)}/>
            <input type="number"placeholder="Price"value={price}onChange={(e) =>setPrice(e.target.value)}/>
            <input type="text"placeholder="Stock"value={stock}onChange={(e) => setStock(e.target.value)}/>
            <button type="submit">
              Add Product
            </button>
          </form>
        </div>

        <div className="admin-card count-card">
          <h2>Total Products</h2>

          <div className="count">
            {productCount}
          </div>
        </div>
        <div className="admin-card count-card">
            <h2>Total Users</h2>
            <div className="count">
                {userCount}
            </div>
        </div>

      </div>
    </div>
  );
}

export default Admin;