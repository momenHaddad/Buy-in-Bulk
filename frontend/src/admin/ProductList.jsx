import { useState, useEffect } from "react";
import axiosInstance, { getAssetUrl } from "../api/axiosInstance";
import ProductCard from "./ProductCard";

const ProductList = ({ onEditProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        setProducts(products.filter((product) => product._id !== id));
      } catch (err) {
        setError("Failed to delete product");
        console.error(err);
      }
    }
  };

  if (loading)
    return <div className="text-center py-4">Loading products...</div>;
  if (error) return <div className="text-red-600 py-4">{error}</div>;
  if (products.length === 0)
    return <div className="text-center py-4">No products available.</div>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <img
            src={getAssetUrl(product.picture)}
            alt={product.name}
            className="product-image"
          />
          <h2 className="product-title">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <div className="product-bottom">
            <div className="product-details">
              <p className="product-price">
                {product.pricePerUnit.toFixed(2)} TL/ {product.unit}
              </p>
              <p className="product-min">
                Min Order: {product.minOrderQuantity}
              </p>
            </div>

            <div className="product-actions">
              <button
                onClick={() => onEditProduct(product)}
                title="Edit"
                className="action-btn edit-btn"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                title="Delete"
                className="action-btn delete-btn"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
