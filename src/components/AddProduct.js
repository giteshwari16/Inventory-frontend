import React, { useState } from 'react';
import api from '../api';

const AddProduct = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    name: '',
    quantity: '',
    price: '',
    description: ''
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('products/', product);
    onProductAdded();  // Refresh product list after adding
    setProduct({ name: '', quantity: '', price: '', description: '' }); // Clear form
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Add Product</h3>
      <input name="name" value={product.name} onChange={handleChange} placeholder="Name" required /> <br/>
      <input name="quantity" value={product.quantity} onChange={handleChange} placeholder="Quantity" required type="number" /> <br/>
      <input name="price" value={product.price} onChange={handleChange} placeholder="Price" required type="number" /> <br/>
      <input name="description" value={product.description} onChange={handleChange} placeholder="Description" /> <br/>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;