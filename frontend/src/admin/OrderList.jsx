import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/orders');
      setOrders(response.data);
      
      // Gather unique user IDs to fetch user details
      const userIds = new Set();
      response.data.forEach(order => {
        order.participants.forEach(participant => {
          userIds.add(participant.name);
        });
      });
      
      // Fetch user details
      fetchUserDetails(Array.from(userIds));
      
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

  const fetchUserDetails = async (userIds) => {
    const mockUsers = {};
    userIds.forEach(name => {
      mockUsers[name] = { username: `User-${name}` };
    });
    setUsers(mockUsers);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-4">Loading orders...</div>;
  
  if (error) return <div className="text-red-600 py-4">{error}</div>;

  if (orders.length === 0) {
    return <div className="text-center py-4">No orders available.</div>;
  }

return (
  <div className="order-list-container">
    {orders.map((order) => {
      const product = products[order.productId] || { name: 'Unknown Product' };

      return (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <h3 className="order-title">
              Order for {product.name}
            </h3>
            <div className="order-status">
              <span className="status-label">Status:</span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="status-select"
              >
                <option value="Not requested">Not requested</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="order-info">
            <p><span className="info-label">Total Quantity:</span> {order.totalQuantity} {product.unit}</p>
            <p><span className="info-label">Created:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="participants-section">
            <h4 className="participants-title">Participants:</h4>
            <table className="participant-table">
              <thead>
                <tr>
                  <th className="participant-th">User</th>
                  <th className="participant-th">Quantity</th>
                  <th className="participant-th text-right">Requested</th>
                </tr>
              </thead>
              <tbody>
                {order.participants.map((participant, index) => (
                  <tr key={index} className="participant-tr">
                    <td className="participant-td">{participant.name}</td>
                    <td className="participant-td">
                      {participant.quantityRequested}
                    </td>
                    <td className="participant-td text-right td-text-right">
                      {product.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    })}
  </div>
);

};

export default OrderList;