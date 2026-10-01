import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import "../admin/style.css";

const OrderList = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/orders');
      const userOrders = response.data.filter(order =>
        order.participants.some(participant => participant.userId === userId)
      );
      setOrders(userOrders);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      const productMap = {};
      response.data.forEach(product => {
        productMap[product._id] = product;
      });
      setProducts(productMap);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  if (loading) return <div className="order-status">Loading your orders...</div>;
  if (error) return <div className="order-error">{error}</div>;
  if (orders.length === 0) return <div className="order-status">You haven't joined any bulk orders yet.</div>;

  return (
    <div className="order-list">
      {orders.map(order => {
        const product = products[order.productId] || { name: 'Unknown Product', unit: 'units', pricePerUnit: 0 };
        const userParticipation = order.participants.find(p => p.userId === userId);
        const progress = Math.min(100, (order.totalQuantity / product.minOrderQuantity) * 100);

        return (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>{product.name}</h3>
                <p>Status: <strong>{order.status}</strong></p>
              </div>
              <p className="order-date">Order Date: <strong>{new Date(order.createdAt).toLocaleDateString()}</strong></p>
            </div>

            <div className="order-details">
              <div>
                <p>Your Quantity:</p>
                <p><strong>{userParticipation?.quantityRequested} {product.unit}</strong></p>
              </div>
              <div>
                <p>Your Total Cost:</p>
                <p><strong>${(userParticipation?.quantityRequested * product.pricePerUnit).toFixed(2)}</strong></p>
              </div>
              <div>
                  <p className="label">Group Order Progress</p>
                  <p>{order.totalQuantity} {product.unit} total · {order.participants.length} participant(s)</p>
                </div>
                <div>
                  <p className="label">Minimum Required</p>
                  <p>{product.minOrderQuantity} {product.unit}</p>
                </div>
            </div>
          
            <div className="order-progress-box">
              <div className="progress-bar">
                <div
                  className={`progress-fill ${progress >= 100 ? 'green' : 'blue'}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderList;
