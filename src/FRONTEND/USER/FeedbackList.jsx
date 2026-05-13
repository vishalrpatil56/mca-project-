import React, { useEffect, useState } from "react";
import axios from "axios";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import "../../theme.css";

const CustomerFeedbackList = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/feedbacklist")
      .then((r) => setFeedback(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <CusHeader />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <h2 style={{ marginBottom: 24 }}>⭐ Customer Feedback</h2>
        {loading ? <p>Loading...</p> : feedback.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">⭐</div><h3>No feedback yet</h3></div>
        ) : feedback.map((f) => (
          <div key={f.feedback_id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <p style={{ margin: 0 }}>{f.feedback_text || f.feedback_description}</p>
            <small style={{ color: "#9ca3af" }}>Customer #{f.customer_id}</small>
          </div>
        ))}
      </div>
      <CusFooter />
    </div>
  );
};

export default CustomerFeedbackList;
