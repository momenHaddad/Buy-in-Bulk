import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const JoinOrderModal = ({ product, onClose, userId, name }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingOrder, setExistingOrder] = useState(null);

  useEffect(() => {
    checkExistingOrder();
  }, []);

  const checkExistingOrder = async () => {
    try {
      setLoading(true);
      // Check if there's already an open order for this product
      const response = await axiosInstance.get(`/orders/open/${product._id}`);
      setExistingOrder(response.data);
    } catch (err) {
      console.error("Error checking existing orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (existingOrder) {
        await axiosInstance.post(`/orders/${existingOrder._id}/join`, {
          quantityRequested: parseInt(quantity, 10),
        });
        setSuccess("Successfully joined the bulk order!");
      } else {
        await axiosInstance.post("/orders", {
          productId: product._id,
          quantityRequested: parseInt(quantity, 10),
        });
        setSuccess("Successfully created a new bulk order!");
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="card-title text-lg font-semibold">
              Join Bulk Order: {product.name}
            </h2>
            <button
              onClick={onClose}
              className="action-btn text-xl font-bold hover:text-red-500"
            >
              ✖
            </button>
          </div>

          <div className="card-body">
            {error && <div className="alert alert-error mb-4">{error}</div>}
            {success && (
              <div className="alert alert-success mb-4">{success}</div>
            )}
            {existingOrder && (
              <div className="alert alert-info mb-4">
                <p className="font-bold">Existing bulk order found!</p>
                <p>
                  Current quantity: {existingOrder.totalQuantity} {product.unit}
                </p>
                <p>Participants: {existingOrder.participantCount}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="quantity">Quantity ({product.unit})</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
                <small>
                  Minimum: {product.minOrderQuantity} {product.unit}
                </small>
              </div>

              <div className="mb-4">
                <p>
                  <strong>Price per unit:</strong> $
                  {product.pricePerUnit.toFixed(2)}
                </p>
                <p>
                  <strong>Your total:</strong> $
                  {(product.pricePerUnit * quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || quantity < 1}
                  className="btn btn-primary"
                >
                  {loading
                    ? "Processing..."
                    : existingOrder
                      ? "Join Order"
                      : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinOrderModal;
