import React, { useEffect, useState } from "react";
import Header from "./Header1";
import "../../theme.css";

const SerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/feedbacklist")
      .then((r) => r.json())
      .then((data) => setFeedbacks(Array.isArray(data) ? data : []))
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = feedbacks.filter((f) =>
    String(f.feedback_id).includes(search) ||
    (f.feedback_text || f.feedback_description || "").toLowerCase().includes(search.toLowerCase()) ||
    String(f.customer_id || "").includes(search)
  );

  const renderStars = (rating) => {
    const r = Number(rating) || 5;
    return (
      <span style={{ fontSize: 16, color: "#f59e0b" }}>
        {"★".repeat(Math.min(r, 5))}{"☆".repeat(Math.max(0, 5 - r))}
      </span>
    );
  };
const deleteFeedback = async (id) => {
  if (!window.confirm("Are you sure you want to delete this feedback?"))
    return;

  try {
    const res = await fetch(`http://localhost:5000/feedback/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Feedback deleted successfully");

      setFeedbacks((prev) =>
        prev.filter((item) => item.feedback_id !== id)
      );
    }
  } catch (err) {
    alert("Delete failed");
  }
};
  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 60px", fontFamily: "'Outfit', sans-serif" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>⭐ Customer Feedback</h1>
            <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>{feedbacks.length} total feedback entries</p>
          </div>
          <input
            type="text"
            placeholder="Search feedback..."
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
            <div className="empty-icon">⭐</div>
            <h3>{search ? "No feedback matches your search" : "No feedback yet"}</h3>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((f) => (
              <div key={f.feedback_id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af", marginBottom: 6 }}>
                      Feedback #{f.feedback_id} · Customer ID: {f.customer_id || "—"}
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: "#1a1a1a", lineHeight: 1.6 }}>
                      {f.feedback_text || f.feedback_description || "No details provided"}
                    </p>
                    <div style={{ marginTop: 14 }}>
  <button
    onClick={() => deleteFeedback(f.feedback_id)}
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
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {renderStars(f.rating)}
                    {f.rating && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{f.rating}/5</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SerFeedback;
