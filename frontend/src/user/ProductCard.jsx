import React from "react";
import "../admin/style.css";
import { getAssetUrl } from "../api/axiosInstance";

const ProductCard = ({ product, onJoinOrder }) => {
  return (
    <div className="card product-card user-card">
      <div className="card-body product-card-body">
        <img
          src={getAssetUrl(product.picture)}
          alt={product.name}
          className="product-image"
        />
        <h3 className="card-title">{product.name}</h3>
        <p className="text-gray-600 mb-3">{product.description}</p>

        <div className="product-info">
          <div>
            <span className="text-muted">Price per unit:</span>
            <div className="font-bold">
              {product.pricePerUnit.toFixed(2)} TL
            </div>
          </div>
          <div>
            <span className="text-muted">Minimum order:</span>
            <div className="font-bold">
              {product.minOrderQuantity} {product.unit}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={onJoinOrder}
            className="btn btn-primary btn-block join-order-btn"
          >
            Join Bulk Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
