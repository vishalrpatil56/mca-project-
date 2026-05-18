import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import "../../theme.css";
import "./Styles/CusForm.css";

function Cusfeedback() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      toast.warning("Please login first to submit feedback");
      navigate("/cuslogin");
      return;
    }
    if (!feedback.trim()) { setError("Feedback cannot be empty"); return; }
    if (feedback.trim().length < 10) { setError("Please write at least 10 characters"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://98.85.25.190:5000/submit-feedback", { user_id, feedback, rating });
      if (res.data.success) {
        toast.success("Thank you! Your feedback has been submitted.");
        setFeedback("");
        setRating(5);
      } else {
        toast.error("Failed to submit feedback. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <CusHeader />
      <div className="cus-form-page">
        <div className="cus-form-card">
          <div className="cus-form-header">
            <div className="cus-form-icon">⭐</div>
            <h1>Share Your Feedback</h1>
            <p>Your opinion helps us improve our products and services</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="form-label">Your Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" className={`star-btn ${rating >= star ? "active" : ""}`} onClick={() => setRating(star)}>
                    ★
                  </button>
                ))}
                <span className="rating-label">
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                </span>
              </div>
            </div>

            <div className="auth-field">
              <label className="form-label">Your Feedback *</label>
              <textarea
                className={`form-input ${error ? "error" : ""}`}
                value={feedback}
                onChange={(e) => { setFeedback(e.target.value); setError(""); }}
                placeholder="Tell us about your experience with our products or service..."
                rows={5}
                style={{ resize: "vertical" }}
              />
              {error && <span className="field-error">{error}</span>}
              <span style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, display: "block" }}>{feedback.length} characters</span>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <span className="btn-spinner"></span> : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
      <CusFooter />
    </div>
  );
}

export default Cusfeedback;
