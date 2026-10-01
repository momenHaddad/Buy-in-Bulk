import  { useState } from 'react';
import ProductList from './ProductList';
import CreateProduct from './CreateProduct';
import OrderList from './OrderList';
import SendNotification from './SendNotification';
import UserList from './UserList';
import './style.css';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const handleCreateProduct = () => {
    setProductToEdit(null);
    setShowCreateProduct(true);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowCreateProduct(true);
  };

  const handleCloseForm = () => {
    setShowCreateProduct(false);
    setProductToEdit(null);
  };

  const { currentUser, logout, isAdmin } = useAuth();

  return (
    <div className="main-container">
      {/* Sidebar Navigation */}
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
              <span className="nav-icon">📊</span>
              <span>Products</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('orders')}
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            >
              <span className="nav-icon">📦</span>
              <span>Orders</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
            >
              <span className="nav-icon">🔔</span>
              <span>Notifications</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('users')}
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            >
              <span className="nav-icon">👥</span>
              <span>Users</span>
            </button>
          </li>
        </ul>
      </div>
      
      {/* Main Content Area */}
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Admin Dashboard</h1>
          <button onClick={logout} className="logout-btn" title="Logout">
                      <FaSignOutAlt size={20} /> {/* Logout icon */}
                    </button>
        </div>
        
        {activeTab === 'products' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Product Management</h2>
              {!showCreateProduct && (
                <button 
                  onClick={handleCreateProduct}
                  className="btn btn-primary"
                >
                  Create New Product
                </button>
              )}
            </div>
            
            {showCreateProduct ? (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    {productToEdit ? 'Edit Product' : 'Create New Product'}
                  </h3>
                  <button 
                    onClick={handleCloseForm}
                    className="action-btn"
                  >
                    <span className="icon">✖️</span>
                  </button>
                </div>
                <div className="card-body">
                  <CreateProduct 
                    product={productToEdit} 
                    onClose={handleCloseForm} 
                  />
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-body">
                  <ProductList onEditProduct={handleEditProduct} />
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Order Management</h2>
            </div>
            <div className="card">
              <div className="card-body">
                <OrderList />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Send Notifications</h2>
            </div>
            <div className="card">
              <div className="card-body">
                <SendNotification />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">User Management</h2>
            </div>
            <div className="card">
              <div className="card-body">
                <UserList />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;