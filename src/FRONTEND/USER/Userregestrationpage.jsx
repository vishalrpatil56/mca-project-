import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import "../../theme.css";
import "./Styles/userLoginpage.css";

const UserRegistrationPage = () => {
  const [formData, setFormData] = useState({ userName: "", userContact: "", userEmail: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.userName.trim()) errs.userName = "Name is required";
    else if (formData.userName.trim().length < 2) errs.userName = "Name must be at least 2 characters";

    if (!formData.userContact.trim()) errs.userContact = "Contact number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.userContact.trim())) errs.userContact = "Enter a valid 10-digit Indian mobile number";

    if (!formData.userEmail.trim()) errs.userEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) errs.userEmail = "Enter a valid email address";

    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 8) errs.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) errs.password = "Password must contain uppercase, lowercase, and a number";

    if (!formData.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { userName, userContact, userEmail, password } = formData;
      const response = await axios.post("http://localhost:5000/api/register", { userName, userContact, userEmail, password });
      toast.success("Account created successfully! Please login.");
      setFormData({ userName: "", userContact: "", userEmail: "", password: "", confirmPassword: "" });
      setTimeout(() => navigate("/cuslogin"), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed. Please try again.";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CusHeader />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card" style={{ maxWidth: 520 }}>
            <div className="auth-header">
              <div className="auth-icon">👤</div>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Join Balaji Enterprises for the best home appliance experience</p>
            </div>

            {errors.general && <div className="auth-alert auth-alert-error">{errors.general}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label className="form-label">Full Name</label>
                <input type="text" name="userName" className={`form-input ${errors.userName ? "error" : ""}`} value={formData.userName} onChange={handleChange} placeholder="Enter your full name" />
                {errors.userName && <span className="field-error">{errors.userName}</span>}
              </div>

              <div className="auth-field">
                <label className="form-label">Mobile Number</label>
                <input type="tel" name="userContact" className={`form-input ${errors.userContact ? "error" : ""}`} value={formData.userContact} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10} />
                {errors.userContact && <span className="field-error">{errors.userContact}</span>}
              </div>

              <div className="auth-field">
                <label className="form-label">Email Address</label>
                <input type="email" name="userEmail" className={`form-input ${errors.userEmail ? "error" : ""}`} value={formData.userEmail} onChange={handleChange} placeholder="you@example.com" />
                {errors.userEmail && <span className="field-error">{errors.userEmail}</span>}
              </div>

              <div className="auth-field">
                <label className="form-label">Password</label>
                <input type="password" name="password" className={`form-input ${errors.password ? "error" : ""}`} value={formData.password} onChange={handleChange} placeholder="Min 8 chars, uppercase, lowercase, number" />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="auth-field">
                <label className="form-label">Confirm Password</label>
                <input type="password" name="confirmPassword" className={`form-input ${errors.confirmPassword ? "error" : ""}`} value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <span className="btn-spinner"></span> : "Create Account"}
              </button>
            </form>

            <p className="auth-link-text">
              Already have an account? <Link to="/cuslogin" className="auth-link">Sign in here</Link>
            </p>
          </div>

          <div className="auth-info-panel">
            <div className="auth-info-content">
              <h2>Why Join Us?</h2>
              <p>Thousands of customers trust Balaji Enterprises every day. Here's what you get:</p>
              <ul className="auth-benefits">
                <li>🛒 Easy online shopping</li>
                <li>📦 Fast home delivery</li>
                <li>🔧 Professional installation</li>
                <li>⭐ Exclusive member deals</li>
                <li>📞 Dedicated customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <CusFooter />
    </>
  );
};

export default UserRegistrationPage;
