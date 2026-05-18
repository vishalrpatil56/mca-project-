import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import { FaBox, FaTrash, FaSearch } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import "../../theme.css";
import "./Styles/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to view your orders");
      navigate("/cuslogin");
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://98.85.25.190:5000/get-orders");
      setOrders(res.data.orders || []);
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await axios.delete(`http://98.85.25.190:5000/delete-order/${orderId}`);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch { toast.error("Failed to cancel order"); }
  };

  const filtered = orders.filter((o) =>
    String(o.order_id).includes(searchTerm) ||
    (o.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.order_date || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (!status) return "#6b7280";
    const s = status.toLowerCase();
    if (s.includes("delivered")) return "#10b981";
    if (s.includes("cancel")) return "#ef4444";
    if (s.includes("process") || s.includes("pending")) return "#f59e0b";
    return "#3b82f6";
  };

  return (
    <div className="page-wrapper">
      <CusHeader />
      <div className="orders-page">
        <div className="orders-header">
          <div>
            <h1>My Orders</h1>
            <p>{orders.length} total order{orders.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="orders-search">
            <FaSearch className="orders-search-icon" />
            <input type="text" placeholder="Search by order ID, name, date..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}><div className="spinner" style={{ margin: "0 auto" }}></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>{searchTerm ? "No orders match your search" : "No orders yet"}</h3>
            <p>{searchTerm ? "Try a different search term" : "Start shopping to see your orders here"}</p>
            {!searchTerm && <button className="btn-primary-custom" onClick={() => navigate("/")}>Start Shopping</button>}
          </div>
        ) : (
          <div className="orders-list">
            {filtered.map((order) => (
              <div key={order.order_id} className="order-card">
                <div className="order-card-header">
                  <div className="order-id-info">
                    <FaBox className="order-icon" />
                    <div>
                      <div className="order-id">Order #{order.order_id}</div>
                      <div className="order-date">{order.order_date ? new Date(order.order_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}</div>
                    </div>
                  </div>
                  <div className="order-meta-right">
                    {order.status && (
                      <span className="order-status" style={{ background: getStatusColor(order.status) + "20", color: getStatusColor(order.status) }}>
                        {order.status}
                      </span>
                    )}
                    <button className="order-cancel-btn" onClick={() => deleteOrder(order.order_id)} title="Cancel Order">
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-info-grid">
                    <div className="order-info-item"><span className="oi-label">Customer</span><span className="oi-value">{order.name || "—"}</span></div>
                    <div className="order-info-item"><span className="oi-label">Phone</span><span className="oi-value">{order.phone || "—"}</span></div>
                    <div className="order-info-item"><span className="oi-label">Email</span><span className="oi-value">{order.email || "—"}</span></div>
                    <div className="order-info-item"><span className="oi-label">Payment</span><span className="oi-value">{order.payment_mode || "—"}</span></div>
                  </div>
                  {order.address && <div className="order-address"><span className="oi-label">📍 Address: </span>{order.address}</div>}

                  {order.products && Array.isArray(order.products) && order.products.length > 0 && (
                    <div className="order-products">
                      <div className="op-title">Products</div>
                      {order.products.map((p, i) => (
                        <div key={i} className="op-item">
                          <span className="op-name">{p.name}</span>
                          <span className="op-qty">× {p.quantity || 1}</span>
                          <span className="op-price">₹{Number(p.price).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="order-card-footer">
                  <div className="order-total">Total: <strong>₹{Number(order.total_price || 0).toLocaleString("en-IN")}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CusFooter />
    </div>
  );
};

export default Orders;
