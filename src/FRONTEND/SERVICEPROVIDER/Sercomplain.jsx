import React, { useEffect, useState } from "react";
import Header from "./Header1";
import "../../theme.css";

const SerComplain = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://98.85.25.190:5000/complainlist")
      .then((r) => r.json())
      .then((data) => setComplaints(Array.isArray(data) ? data : []))
      .catch(() => setComplaints([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = complaints.filter((c) =>
    String(c.complain_id).includes(search) ||
    (c.complain_text || "").toLowerCase().includes(search.toLowerCase()) ||
    String(c.customer_id || "").includes(search)
  );

  const getStatusStyle = (status) => {
    if (!status || status === "pending") return { bg: "#fffbeb", color: "#f59e0b", border: "#fde68a" };
    if (status === "resolved")           return { bg: "#f0fdf4", color: "#10b981", border: "#bbf7d0" };
    return                                      { bg: "#f0f9ff", color: "#3b82f6", border: "#bfdbfe" };
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 60px", fontFamily: "'Outfit', sans-serif" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>📋 Customer Complaints</h1>
            <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>{complaints.length} total complaints</p>
          </div>
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 14px", fontSize: 14, outline: "none", minWidth: 240, fontFamily: "inherit" }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div className="spinner" style={{ margin: "0 auto" }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>{search ? "No complaints match your search" : "No complaints yet"}</h3>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((c) => {
  const s = getStatusStyle(c.status);

  const resolveComplaint = async (id) => {
    

    try {
      const res = await fetch(`http://98.85.25.190:5000/complain/resolve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (data.success) {
        alert("Complaint resolved successfully");

        setComplaints((prev) =>
          prev.map((item) =>
            item.complain_id === id
              ? {
                  ...item,
                  status: "resolved",
                }
              : item
          )
        );
      }
    } catch (err) {
      alert("Failed to resolve complaint");
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      const res = await fetch(`http://98.85.25.190:5000/complain/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Complaint deleted");

        setComplaints((prev) =>
          prev.filter((item) => item.complain_id !== id)
        );
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div
      key={c.complain_id}
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#9ca3af",
              marginBottom: 6,
            }}
          >
            Complaint #{c.complain_id} · Customer ID: {c.customer_id || "—"}
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#1a1a1a",
              lineHeight: 1.6,
            }}
          >
            {c.complain_text || "No details provided"}
          </p>

          {c.status !== "resolved" && c.resolve_time && (
  <p
    style={{
      marginTop: 10,
      fontSize: 13,
      color: "#f59e0b",
      fontWeight: 600,
    }}
  >
    ⏳ Estimated resolution time: {c.resolve_time}
  </p>
)}

{c.status === "resolved" && (
  <p
    style={{
      marginTop: 10,
      fontSize: 13,
      color: "#10b981",
      fontWeight: 600,
    }}
  >
    ✅ Resolved on:{" "}
    {new Date(c.resolved_at).toLocaleString()}
  </p>
)}

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 14,
            }}
          >
            {c.status !== "resolved" && (
              <button
                onClick={() => resolveComplaint(c.complain_id)}
                style={{
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Resolve
              </button>
            )}

            <button
              onClick={() => deleteComplaint(c.complain_id)}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Delete
            </button>
          </div>
        </div>

        <span
          style={{
            background: s.bg,
            color: s.color,
            border: `1px solid ${s.border}`,
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 99,
            flexShrink: 0,
            textTransform: "capitalize",
          }}
        >
          {c.status || "Pending"}
        </span>
      </div>
    </div>
  );
})}
          </div>
        )}
      </div>
    </>
  );
};

export default SerComplain;
