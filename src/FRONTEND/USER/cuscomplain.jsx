import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import "../../theme.css";
import "./Styles/CusForm.css";

function Cuscomplain() {
  const [complain, setComplain] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!subject.trim()) errs.subject = "Subject is required";
    if (!complain.trim()) errs.complain = "Complaint details are required";
    else if (complain.trim().length < 10) errs.complain = "Please describe your issue in at least 10 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customer_id = localStorage.getItem("user_id");
    if (!customer_id) {
      toast.warning("Please login first to submit a complaint");
      navigate("/cuslogin");
      return;
    }
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/complaint", {
        customer_id, complain_text: `${subject}: ${complain}`,
      });
      toast.success("Complaint submitted! We'll get back to you shortly.");
      setComplain("");
      setSubject("");
    } catch {
      toast.error("Failed to submit complaint. Please try again.");
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
            <div className="cus-form-icon">📋</div>
            <h1>Submit a Complaint</h1>
            <p>We're here to help. Describe your issue and we'll resolve it promptly.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="form-label">Subject *</label>
              <input
                type="text"
                className={`form-input ${errors.subject ? "error" : ""}`}
                value={subject}
                onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: "" })); }}
                placeholder="e.g. Defective product, Delivery issue, Poor service..."
              />
              {errors.subject && <span className="field-error">{errors.subject}</span>}
            </div>

            <div className="auth-field">
              <label className="form-label">Complaint Details *</label>
              <textarea
                className={`form-input ${errors.complain ? "error" : ""}`}
                value={complain}
                onChange={(e) => { setComplain(e.target.value); setErrors((p) => ({ ...p, complain: "" })); }}
                placeholder="Please describe your complaint in detail. Include order ID if applicable..."
                rows={6}
                style={{ resize: "vertical" }}
              />
              {errors.complain && <span className="field-error">{errors.complain}</span>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <span className="btn-spinner"></span> : "Submit Complaint"}
            </button>
          </form>
        </div>
      </div>
      <CusFooter />
    </div>
  );
}

export default Cuscomplain;
