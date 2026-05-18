import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "../../theme.css";
import "./Style/Loginpage.css";

const SPRegistrationPage = () => {
  const [formData, setFormData] = useState({ userName: "", userContact: "", userEmail: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.userName.trim() || formData.userName.trim().length < 2) errs.userName = "Name must be at least 2 characters";
    if (!formData.userContact || !/^[6-9]\d{9}$/.test(formData.userContact)) errs.userContact = "Enter a valid 10-digit mobile number";
    if (!formData.userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) errs.userEmail = "Enter a valid email address";
    if (!formData.password || formData.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post("http://98.85.25.190:5000/api/serviceproviderregister", {
        userName: formData.userName, userContact: formData.userContact,
        userEmail: formData.userEmail, password: formData.password,
      });
      toast.success("Registration successful! Please login.");
      setTimeout(() => navigate("/loginpage"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sp-auth-page">
      <div className="sp-auth-card" style={{ maxWidth: 500 }}>
        <div className="sp-auth-header">
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔧</div>
          <h1>Become a Service Partner</h1>
          <p>Register to offer your services on Balaji Enterprises</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {[
            { name: "userName", label: "Full Name", type: "text", placeholder: "Your full name" },
            { name: "userContact", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile number" },
            { name: "userEmail", label: "Email Address", type: "email", placeholder: "your@email.com" },
            { name: "password", label: "Password (min 8 chars)", type: "password", placeholder: "Create a strong password" },
            { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Re-enter your password" },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name} className="auth-field">
              <label className="form-label">{label}</label>
              <input
                type={type} name={name}
                className={`form-input ${errors[name] ? "error" : ""}`}
                value={formData[name]} onChange={handleChange}
                placeholder={placeholder}
                maxLength={name === "userContact" ? 10 : undefined}
              />
              {errors[name] && <span className="field-error">{errors[name]}</span>}
            </div>
          ))}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : "Create Account"}
          </button>
        </form>

        <p className="auth-link-text" style={{ marginTop: 16 }}>
          Already have an account? <Link to="/loginpage" className="auth-link">Sign in</Link>
        </p>
        <p className="auth-link-text">
          <Link to="/" className="auth-link" style={{ color: "#6b7280" }}>← Back to Store</Link>
        </p>
      </div>
    </div>
  );
};

export default SPRegistrationPage;
