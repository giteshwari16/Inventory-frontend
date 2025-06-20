import axios from 'axios';

const API_BASE = "http://localhost:8000/";

export const fetchProducts = () => axios.get(`${API_BASE}products/`);
export const deleteProduct = (id) => axios.delete(`${API_BASE}products/${id}/`);
export const fetchLowStock = () => axios.get(`${API_BASE}low-stock/`);
export const downloadPDF = () => window.open(`${API_BASE}report/pdf/`);