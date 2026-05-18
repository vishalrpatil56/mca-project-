import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import "./Style/CustomerList.css";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://98.85.25.190:5000/feedbacklist")
      .then((r) => setFeedbacks(r.data))
      .catch(() => toast.error("Failed to load feedback"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = feedbacks.filter((f) =>
    (f.feedback_text || "").toLowerCase().includes(search.toLowerCase()) ||
    String(f.customer_id || "").includes(search)
  );

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">⭐ Feedback Management</h1>
            <p className="admin-page-subtitle">{feedbacks.length} total feedback entries</p>
          </div>
          <div className="admin-search-box">
            <FaSearch className="admin-search-icon" />
            <input type="text" placeholder="Search feedback..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading feedback...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Feedback ID</th>
                  <th>Feedback</th>
                  <th>Customer ID</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>No feedback found</td></tr>
                ) : filtered.map((f, idx) => (
                  <tr key={f.feedback_id}>
                    <td className="td-muted">{idx + 1}</td>
                    <td className="td-bold">#{f.feedback_id}</td>
                    <td style={{ maxWidth: 360 }}>{f.feedback_text}</td>
                    <td>{f.customer_id}</td>
                    <td>
                      <span style={{ color: "#f59e0b", fontSize: 16 }}>
                        {"★".repeat(f.rating || 5)}{"☆".repeat(5 - (f.rating || 5))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default FeedbackList;
