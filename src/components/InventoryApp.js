import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast, Slide } from "react-toastify";
import { Bar, Line } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import "react-toastify/dist/ReactToastify.css";
// Chart.js registration for v3+
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FiLogOut, FiEdit2, FiTrash2, FiDownload, FiUser, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiSearch, FiPlus, FiFileText, FiBarChart2 } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
// For Excel export
// npm install react-data-export
// import { ExcelFile, ExcelSheet } from "react-data-export";

const API = "http://localhost:8000";

function InventoryApp() {
  // Auth
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  // Products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);

  // Add/Edit
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);

  // Search/Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [minQty, setMinQty] = useState("");

  // Modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Low stock
  const [lowStock, setLowStock] = useState([]);

  // AI Forecast
  const [forecast, setForecast] = useState(null);

  // Chart
  const chartData = {
    labels: products.map((p) => p.name),
    datasets: [
      {
        label: "Quantity",
        data: products.map((p) => p.quantity),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
      },
    ],
  };

  // Additional state for login form
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [inputError, setInputError] = useState({});

  // Auth: login and decode role
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const decoded = jwtDecode(token);
        // Robust role detection: check groups, is_superuser, is_staff
        const groups = decoded.groups || [];
        setIsAdmin(
          (Array.isArray(groups) && groups.includes("admin")) ||
          decoded.is_superuser === true
        );
        setIsStaff(
          (Array.isArray(groups) && groups.includes("staff")) ||
          decoded.is_staff === true
        );
      } catch {
        setIsAdmin(false);
        setIsStaff(false);
      }
    } else {
      setIsAdmin(false);
      setIsStaff(false);
    }
  }, [token]);

  // Ensure Axios always sends the JWT token if present
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  // Fetch products
  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setSkeleton(true);
    try {
      const res = await axios.get(`${API}/products/`, { params });
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
    setLoading(false);
    setTimeout(() => setSkeleton(false), 800); // skeleton for 0.8s
  };

  // Fetch low stock
  const fetchLowStock = async () => {
    try {
      const res = await axios.get(`${API}/low-stock/?threshold=5`);
      setLowStock(res.data);
      if (res.data.length > 0) {
        toast.warn("Some products are low in stock!");
      }
    } catch {}
  };

  // Fetch AI forecast (placeholder)
  const fetchForecast = async () => {
    // Placeholder: just sum all quantities
    const total = products.reduce((acc, p) => acc + Number(p.quantity), 0);
    setForecast(`Predicted demand next month: ${Math.round(total * 1.1)}`);
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
      fetchLowStock();
    }
    // eslint-disable-next-line
  }, [token]);

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/token/`, { username, password });
      setToken(res.data.access);
      localStorage.setItem("token", res.data.access);
      toast.success("Login successful!");
    } catch {
      toast.error("Login failed");
    }
  };

  // Logout
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = "";
    setProducts([]);
  };

  // Add or Edit Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !quantity || !price) {
      toast.error("All fields are required!");
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        await axios.put(`${API}/products/${editing.id}/`, {
          name,
          quantity: Number(quantity),
          price: Number(price),
          description,
        });
        toast.success("Product updated!");
      } else {
        await axios.post(`${API}/products/`, {
          name,
          quantity: Number(quantity),
          price: Number(price),
          description,
        });
        toast.success("Product added!");
      }
      setName("");
      setQuantity("");
      setPrice("");
      setDescription("");
      setEditing(null);
      fetchProducts();
      fetchLowStock();
    } catch (err) {
      toast.error("Failed to save product");
      console.log(err.response?.data); // Log backend error for debugging
    }
    setLoading(false);
  };

  // Edit
  const startEdit = (product) => {
    setEditing(product);
    setName(product.name);
    setQuantity(product.quantity);
    setPrice(product.price);
    setDescription(product.description);
  };

  // Delete
  const askDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      await axios.delete(`${API}/products/${deleteId}/`);
      toast.success("Product deleted!");
      fetchProducts();
      fetchLowStock();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Delete failed (admin only)"
      );
    }
    setLoading(false);
  };

  // Search/filter
  const handleSearch = () => {
    fetchProducts({ name: searchTerm, min_qty: minQty });
  };

  // PDF/CSV/Excel
  const handleDownloadPDF = () => {
    window.open(`${API}/report/pdf/`, "_blank");
  };

  // UI
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 font-sans">
        <form
          onSubmit={handleLogin}
          className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-blue-100 animate-fade-in"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mb-2">
              <FiUser className="text-blue-500 text-3xl" />
            </div>
            <h2 className="text-3xl font-extrabold text-blue-700 text-center tracking-tight">Login</h2>
          </div>
          <input
            className="border border-blue-200 p-3 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoFocus
          />
          <div className="relative mb-3">
            <input
              className="border border-blue-200 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe((v) => !v)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-gray-600 text-sm">Remember me</label>
          </div>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg w-full font-semibold shadow transition flex items-center justify-center gap-2"
            type="submit"
          >
            <FiCheckCircle /> Login
          </button>
        </form>
        <ToastContainer position="top-center" transition={Slide} theme="colored" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 font-sans">
      {/* Header/Navbar */}
      <nav className="fixed top-0 left-0 w-full z-30 bg-white/90 shadow-md border-b border-blue-100 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <FiBarChart2 className="text-blue-600 text-2xl" />
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight">Inventory Manager</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-lg transition">
          <FiLogOut /> Logout
        </button>
      </nav>
      <div className="pt-24 max-w-6xl mx-auto px-2 md:px-6">
        {/* Low Stock Warning Banner */}
        {lowStock.length > 0 && (
          <div className="flex items-center gap-2 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow mb-6 animate-fade-in">
            <FiAlertCircle className="text-yellow-500 text-xl" />
            <span>Some products are low in stock!</span>
          </div>
        )}

        {/* Search & Filter Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
              <input
                className="pl-10 pr-3 py-2 border border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Search by name"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <input
              className="px-3 py-2 border border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Min Quantity"
              type="number"
              value={minQty}
              onChange={e => setMinQty(e.target.value)}
            />
            <button type="submit" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition">
              <FiSearch /> Search
            </button>
            <button type="button" onClick={() => { setSearchTerm(""); setMinQty(""); fetchProducts(); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg px-4 py-2 transition">
              Reset
            </button>
          </form>
        </div>

        {/* Add Product Section (Modal) */}
        <div className="flex justify-end mb-6">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-5 py-2 shadow transition">
            <FiPlus /> Add Product
          </button>
        </div>
        {showAddModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100 relative">
              <button onClick={() => setShowAddModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-xl">&times;</button>
              <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FiPlus /> Add Product</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                <input className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
                <input className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                <input className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                {Object.entries(inputError).map(([field, msg]) => (
                  <span key={field} className="text-red-500 text-xs flex items-center gap-1"><FiAlertCircle /> {msg}</span>
                ))}
                <button type="submit" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition">
                  <FiPlus /> Add Product
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Report & Forecast Section */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6">
          <div className="flex gap-3">
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 border border-purple-500 text-purple-700 hover:bg-purple-50 font-semibold rounded-lg px-4 py-2 transition">
              <FiFileText /> PDF Report
            </button>
            <CSVLink data={products} filename="products.csv" className="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 font-semibold rounded-lg px-4 py-2 transition">
              <FiDownload /> Export CSV
            </CSVLink>
          </div>
          <button onClick={fetchForecast} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-5 py-2 shadow transition">
            <FiBarChart2 /> Forecast Demand (AI)
          </button>
          {forecast && <div className="text-indigo-700 font-semibold mt-2">{forecast}</div>}
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="chart-container">
            <Bar 
              data={chartData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false, 
                plugins: {
                  title: {
                    display: true,
                    text: 'Product Quantity Distribution',
                    font: { size: 18, weight: 'bold' },
                    color: '#3730a3',
                    padding: { bottom: 20 }
                  }
                },
                scales: { x: { grid: { display: false } }, y: { grid: { display: true } } },
                borderRadius: 8 
              }} 
              height={300} 
            />
          </div>
          <div className="chart-container">
            <Line 
              data={chartData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false, 
                tension: 0.4,
                plugins: {
                  title: {
                    display: true,
                    text: 'Sales & Stock Trend',
                    font: { size: 18, weight: 'bold' },
                    color: '#3730a3',
                    padding: { bottom: 20 }
                  }
                },
                scales: { x: { grid: { display: false } }, y: { grid: { display: true } } }
              }} 
              height={300} 
            />
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-blue-100">
            <caption className="caption-top text-lg font-bold text-blue-700 mb-2">Product Inventory</caption>
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-blue-800">Name</th>
                <th className="px-4 py-3 text-center font-semibold text-blue-800">Quantity</th>
                <th className="px-4 py-3 text-center font-semibold text-blue-800">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-800">Description</th>
                <th className="px-4 py-3 text-center font-semibold text-blue-800">Last Updated</th>
                <th className="px-4 py-3 text-center font-semibold text-blue-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {skeleton
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="h-10 bg-blue-100 rounded" />
                    </tr>
                  ))
                : products.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-3 font-semibold text-blue-900">{p.name}</td>
                      <td className="px-4 py-3 text-center">{p.quantity}</td>
                      <td className="px-4 py-3 text-center">₹{Number(p.price).toLocaleString()}</td>
                      <td className="px-4 py-3">{p.description}</td>
                      <td className="px-4 py-3 text-center">{p.last_updated ? new Date(p.last_updated).toLocaleString() : ""}</td>
                      <td className="px-4 py-3 flex gap-2 items-center justify-center">
                        <button onClick={() => startEdit(p)} className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition" title="Edit">
                          <FiEdit2 />
                        </button>
                        {isAdmin && (
                          <button onClick={() => askDelete(p.id)} className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 transition" title="Delete">
                            <FiTrash2 />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Confirm Delete Modal */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-blue-200">
              <p className="mb-6 text-lg font-semibold text-gray-800 flex items-center gap-2"><FiAlertCircle className="text-red-400" /> Are you sure you want to delete this product?</p>
              <div className="flex gap-6">
                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow transition flex items-center gap-2" onClick={confirmDelete}>
                  <FiTrash2 /> Yes, Delete
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-bold shadow transition" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-xs pb-6">
          &copy; {new Date().getFullYear()} Inventory Management System. Contact: support@example.com | v1.0.0
        </footer>
      </div>
    </div>
  );
}

export default InventoryApp; 