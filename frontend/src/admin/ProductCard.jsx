
import  React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ProductCard from './ProductCard';
import CreateProduct from './CreateProduct';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
      console.log(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowCreateModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosInstance.delete(`/products/${productId}`);
        setProducts(products.filter(p => p._id !== productId));
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedProduct(null);
    fetchProducts(); // Refresh product list
  };

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4" role="alert">
        <span className="block sm:inline">{error}</span>
    </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products found. Add your first product!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {/* Modal for creating/editing product */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <CreateProduct product={selectedProduct} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;



