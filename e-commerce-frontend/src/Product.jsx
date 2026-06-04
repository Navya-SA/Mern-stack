import { useEffect, useState } from "react";
import axios from "axios";
import "./Product.css";
import Navbar from "./Navbar";

function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/products"
      );

      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };
  const handleBuyNow = async (productId) => {
  try {
    const userId = localStorage.getItem("_id");

    // Store product ID in local storage
    localStorage.setItem("productId", productId);

    const response = await axios.post(
      "http://localhost:3000/orders",
      {
        userId,
        productId,
      }
    );

    alert(response.data.message);
  } catch (error) {
    console.log(error);
    alert("Purchase failed");
  }
};
  return (
    <>
      <Navbar />

      <div className="product-page">
        <h1>Products</h1>

        <div className="product-container">
          {products.map((product) => (
            <div
              className="product-card"
              key={product._id}
            >
              <h2>{product.name}</h2>

              <p>
                <strong>Description:</strong>{" "}
                {product.description}
              </p>

              <p>
                <strong>Price:</strong> ₹{product.price}
              </p>

              <p>
                <strong>Stock:</strong> {product.stock}
              </p>
              <button className="Buy-btn" onClick={() => handleBuyNow(product._id)}>Buy Now</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Product;