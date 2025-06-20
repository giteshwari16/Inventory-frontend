import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
});

export const fetchProducts = async () => {
  const response = await api.get('products/');
  console.log('Products API response:', response.data);
  return response.data;
};

export const fetchLowStock = async () => {
  const response = await api.get('low-stock/');
  return response.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`products/${id}/`);
};

export const downloadPDF = () => {
  window.open('http://localhost:8000/report/pdf/', '_blank');
};

export default api;