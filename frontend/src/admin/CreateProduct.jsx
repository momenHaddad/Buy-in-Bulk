/*
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const CreateProduct = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',  // Added description field
    pricePerUnit: '',
    minOrderQuantity: '',
    unit: '',
    picture: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        pricePerUnit: product.pricePerUnit,
        minOrderQuantity: product.minOrderQuantity,
        unit: product.unit,
        picture: product.picture || '',
      });
      
      if (product.picture) {
        setImagePreview(product.picture);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (productId) => {
    if (!imageFile) return null;
    
    const formData = new FormData();
    formData.append('productImage', imageFile);
    
    const response = await axiosInstance.post(
      `/products/uploads/${productId}`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data.filePath;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        minOrderQuantity: parseInt(formData.minOrderQuantity)
      };

      let productId;
      
      if (product) {
        // Update existing product
        await axiosInstance.patch(`/products/${product._id}`, payload);
        productId = product._id;
        
        if (imageFile) {
          const imagePath = await uploadImage(productId);
          if (imagePath) {
            payload.picture = imagePath;
            await axiosInstance.patch(`/products/${productId}`, { picture: imagePath });
          }
        }
        
        setSuccess('Product updated successfully!');
      } else {
        // Create new product
        const response = await axiosInstance.post('/products', payload);
        productId = response.data._id || response.data.product._id;
        
        if (imageFile) {
          const imagePath = await uploadImage(productId);
          if (imagePath) {
            await axiosInstance.patch(`/products/${productId}`, { picture: imagePath });
          }
        }
        
        setSuccess('Product created successfully!');
        setFormData({
          name: '',
          description: '',
          pricePerUnit: '',
          minOrderQuantity: '',
          unit: '',
          picture: '',
        });
        setImageFile(null);
        setImagePreview('');
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {product ? 'Edit Product' : 'Create New Product'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pricePerUnit">
              Price Per Unit
            </label>
            <input
              id="pricePerUnit"
              name="pricePerUnit"
              type="number"
              step="0.01"
              min="0"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.pricePerUnit}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="minOrderQuantity">
              Min Order Quantity
            </label>
            <input
              id="minOrderQuantity"
              name="minOrderQuantity"
              type="number"
              min="1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.minOrderQuantity}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unit">
              Unit
            </label>
            <input
              id="unit"
              name="unit"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g., kg, box, etc."
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productImage">
            Product Image
          </label>
          <input
            id="productImage"
            name="productImage"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            onChange={handleFileChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
              <img 
                src={imagePreview.startsWith('blob:') ? imagePreview : imagePreview} 
                alt="Product preview" 
                className="h-32 w-auto object-contain rounded border border-gray-200"
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

*/


// CreateProduct.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const CreateProduct = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerUnit: '',
    minOrderQuantity: '',
    unit: '',
    picture: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        pricePerUnit: product.pricePerUnit || '',
        minOrderQuantity: product.minOrderQuantity || '',
        unit: product.unit || '',
        picture: product.picture || '',
      });
      
      if (product.picture) {
        // If the picture path is just an ID, construct the full URL
        if (product.picture.startsWith('/')) {
          setImagePreview(`${axiosInstance.defaults.baseURL}${product.picture}`);
        } else {
          setImagePreview(product.picture);
        }
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (productId) => {
    if (!imageFile) return null;
    
    const formData = new FormData();
    formData.append('productImage', imageFile);
    
    try {
      // Make sure this URL matches the route we defined in productRoutes.js
      const response = await axiosInstance.post(
        `/products/uploads/${productId}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('Image upload response:', response.data);
      return response.data.filePath;
    } catch (error) {
      console.error('Error uploading image:', error.response || error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        minOrderQuantity: parseInt(formData.minOrderQuantity)
      };

      let productId;
      
      if (product) {
        // Update existing product
        const updateResponse = await axiosInstance.patch(`/products/${product._id}`, payload);
        console.log('Product update response:', updateResponse.data);
        productId = product._id;
        
        if (imageFile) {
          try {
            const imagePath = await uploadImage(productId);
            if (imagePath) {
              await axiosInstance.patch(`/products/${productId}`, { picture: imagePath });
            }
          } catch (imgError) {
            console.error('Failed to upload image:', imgError);
            setError('Product updated but image upload failed');
            setLoading(false);
            return;
          }
        }
        
        setSuccess('Product updated successfully!');
      } else {
        // Create new product
        const createResponse = await axiosInstance.post('/products', payload);
        console.log('Product creation response:', createResponse.data);
        productId = createResponse.data._id;
        
        if (imageFile && productId) {
          try {
            const imagePath = await uploadImage(productId);
            if (imagePath) {
              await axiosInstance.patch(`/products/${productId}`, { picture: imagePath });
            }
          } catch (imgError) {
            console.error('Failed to upload image:', imgError);
            setError('Product created but image upload failed');
            setLoading(false);
            return;
          }
        }
        
        setSuccess('Product created successfully!');
        setFormData({
          name: '',
          description: '',
          pricePerUnit: '',
          minOrderQuantity: '',
          unit: '',
          picture: '',
        });
        setImageFile(null);
        setImagePreview('');
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Submit error:', err.response || err);
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

 return (
  <div>
      {error && (
        <div className="badge badge-danger mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="badge badge-success mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Grid Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Price Per Unit */}
          <div className="form-group">
            <label htmlFor="pricePerUnit" className="form-label">Price Per Unit</label>
            <input
              id="pricePerUnit"
              name="pricePerUnit"
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              value={formData.pricePerUnit}
              onChange={handleChange}
              required
            />
          </div>

          {/* Min Order Quantity */}
          <div className="form-group">
            <label htmlFor="minOrderQuantity" className="form-label">Min Order Quantity</label>
            <input
              id="minOrderQuantity"
              name="minOrderQuantity"
              type="number"
              min="1"
              className="form-control"
              value={formData.minOrderQuantity}
              onChange={handleChange}
              required
            />
          </div>

          {/* Unit */}
          <div className="form-group">
            <label htmlFor="unit" className="form-label">Unit</label>
            <input
              id="unit"
              name="unit"
              type="text"
              className="form-control"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g., kg, box, etc."
              required
            />
          </div>
        </div>

        {/* Product Image */}
        <div className="form-group">
          <label htmlFor="productImage" className="form-label">Product Image</label>
          <input
            id="productImage"
            name="productImage"
            type="file"
            accept="image/*"
            className="form-control file-input"
            onChange={handleFileChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-400 mb-1">Image Preview:</p>
              <img 
                src={imagePreview} 
                alt="Product preview" 
                className="h-32 w-auto object-contain rounded border border-gray-600"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm bg-gray-500 text-white hover:bg-gray-600 mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>

);

};

export default CreateProduct;