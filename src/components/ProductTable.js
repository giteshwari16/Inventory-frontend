import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct, fetchLowStock, downloadPDF } from '../api';

const ProductTable = ({ refresh }) => {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const loadProducts = async () => {
    const data = await fetchProducts();
    console.log('Products API response:', data);
    setProducts(Array.isArray(data) ? data : []);
  };
    const loadLowStock = async () => {
    const data = await fetchLowStock();
    setLowStock(data);
  };

  useEffect(() => {
    loadProducts();
    loadLowStock();
  }, [refresh]);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadProducts();
    loadLowStock();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventory Products</h2>
      <button onClick={downloadPDF}>📄 Download PDF Report</button>
      <h4 style={{ color: 'red', marginTop: '20px' }}>
        {lowStock.length > 0 && `${lowStock.length} products are low in stock!`}
      </h4>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Description</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>₹{p.price}</td>
              <td>{p.description}</td>
              <td>{new Date(p.updated_at).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(p.id)}>❌ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;