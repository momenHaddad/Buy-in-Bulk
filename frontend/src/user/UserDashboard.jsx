import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import ProductCard from './ProductCard';
import JoinOrderModal from './JoinOrderModal';
import OrderList from './OrderList';
import '../admin/style.css';
import { FaSignOutAlt } from 'react-icons/fa';
import NotificationList from './NotificationList';

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [storeName, setStoreName] = useState('Your Store');

  useEffect(() => {
    fetchProducts();
    fetchUserDetails();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    // Simulating: replace with real request if needed
    setStoreName('Market Store ' + currentUser.name);
  };

  const handleJoinOrder = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span>Buy in Bulk</span>
          </div>
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('products')}
              className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            >
              <span className="nav-icon">🛒</span>
              <span>Products</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('orders')}
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            >
              <span className="nav-icon">📦</span>
              <span>My Orders</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">{storeName}</h1>
          <div>
            {<NotificationList />}
          
          <button onClick={logout} className="logout-btn" title="Logout">
            <FaSignOutAlt size={20} />
          </button>
          </div>
        </div>

        {loading && <div className="text-center py-8">Loading products...</div>}
        {error && <div className="text-red-600 py-4">{error}</div>}

        {activeTab === 'products' && !loading && !error && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Available Products</h2>
              <p className="text-gray-600">Join bulk orders for discounts!</p>
            </div>
            <div className="card">
              <div className="card-body user-card-body grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {products.length === 0 ? (
                  <div className="text-center py-8 w-full">
                    No products available right now.
                  </div>
                ) : (
                  products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onJoinOrder={() => handleJoinOrder(product)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">My Orders</h2>
            </div>
            <div className="card">
              <div className="card-body">
                <OrderList userId={currentUser.id} />
              </div>
            </div>
          </div>
        )}

        {showModal && selectedProduct && (
          <JoinOrderModal
            product={selectedProduct}
            onClose={handleCloseModal}
            userId={currentUser.id}
            name={currentUser.name}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
