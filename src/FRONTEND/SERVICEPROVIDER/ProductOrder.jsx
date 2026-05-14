import React, { useEffect, useState } from "react";
import { FaBox, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import DownloadReport from "./DownloadReport";
import Header from "./Header1";
import "../../theme.css";

const ProductOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/get-orders");
      const data = await res.json();
      // Group by order_group_id if flat rows returned
      const grouped = {};
      (data.orders || []).forEach((o) => {
        const gid = o.order_id || o.order_group_id;
        if (!grouped[gid]) {
          grouped[gid] = {
            id: gid, date: o.order_date, total: o.total_price,
            customer: { name: o.name, email: o.email, phone: o.phone, address: o.address },
            products: Array.isArray(o.products) ? o.products : [],
          };
        }
      });
      setOrders(Object.values(grouped));
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await fetch(`http://localhost:5000/delete-order/${id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("Order cancelled");
    } catch { toast.error("Failed to cancel order"); }
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>📦 Customer Orders</h1>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}><div className="spinner" style={{ margin: "0 auto" }}></div></div>
        ) : orders.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📦</div><h3>No orders yet</h3></div>
        ) : orders.map((order) => (
          <div key={order.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, marginBottom: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FaBox style={{ color: "#e8400a" }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Order #{String(order.id).slice(-8)}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    {order.date ? new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </div>
                </div>
              </div>
              <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    position: "relative",
    zIndex: 5,
  }}
>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#e8400a" }}>
                  ₹{Number(order.total || 0).toLocaleString("en-IN")}
                </span>
                <DownloadReport order={order} />
                <button className="btn-delete-sm" onClick={() => handleDelete(order.id)}>
                  <FaTrash size={12} /> Cancel
                </button>
                <button
                  style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 6,position: "relative", zIndex: 1, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  {expandedOrder === order.id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </button>
              </div>
            </div>

            {/* Details */}
            {expandedOrder === order.id && (
              <div style={{ padding: "16px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
                  {[["Customer", order.customer?.name], ["Phone", order.customer?.phone], ["Email", order.customer?.email]].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#9ca3af", letterSpacing: "0.5px", marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 14 }}>{val || "—"}</div>
                    </div>
                  ))}
                </div>
                {order.customer?.address && (
                  <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>📍 {order.customer.address}</div>
                )}
                {order.products?.length > 0 && (
                  <div style={{ background: "#f7f7f7", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#9ca3af", marginBottom: 8 }}>Products</div>
                    {order.products.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #ebebeb" }}>
                        <span style={{ fontSize: 13 }}>{p.name || p.product_name}</span>
                        <span style={{ fontSize: 13, color: "#6b7280" }}>× {p.quantity || 1}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#e8400a" }}>₹{Number(p.price || p.product_price || 0).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductOrder;
