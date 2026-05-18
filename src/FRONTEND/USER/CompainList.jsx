import React, { useEffect, useState } from "react";
import axios from "axios";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import "../../theme.css";

const CustomerComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://98.85.25.190:5000/usercomplainlist")
      .then((r) => setComplaints(r.data.complaints || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    if (!status) return "#6b7280";
    if (status === "resolved") return "#10b981";
    if (status === "pending") return "#f59e0b";
    return "#3b82f6";
  };

  return (
    <div className="page-wrapper">
      <CusHeader />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <h2 style={{ marginBottom: 24 }}>📋 My Complaints</h2>
        {loading ? <p>Loading...</p> : complaints.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><h3>No complaints found</h3></div>
        ) : complaints.map((c) => (
          <div key={c.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ margin: 0, flex: 1 }}>{c.message}</p>
              <span style={{ background: getStatusColor(c.status) + "20", color: getStatusColor(c.status), fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99, marginLeft: 12, flexShrink: 0, border: `1px solid ${getStatusColor(c.status)}40` }}>
                {c.status || "Pending"}
              </span>
            </div>
            <small style={{ color: "#9ca3af", display: "block", marginTop: 6 }}>
              {c.user_name} · {c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN") : ""}
            </small>
          </div>
        ))}
      </div>
      <CusFooter />
    </div>
  );
};

export default CustomerComplaintList;
