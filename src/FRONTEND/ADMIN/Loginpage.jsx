import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../theme.css";
import "./Style/Loginpage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("http://98.85.25.190:5000/Adminpenal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("authToken", data.token);
        toast.success("Welcome back, Admin!");
        navigate("/AdminDashboard");
      } else {
        toast.error("Invalid credentials. Please try again.");
        setErrors({ general: "Invalid admin credentials" });
      }
    } catch {
      toast.error("Login failed. Please try again.");
      setErrors({ general: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img src="http://98.85.25.190:5000/uploads/Untitled design.jpeg" alt="Logo" className="admin-login-logo" onError={(e) => { e.target.style.display = "none"; }} />
          <h1>Admin Panel</h1>
          <p>Balaji Enterprises — Home Appliances & Services</p>
        </div>

        {errors.general && (
          <div className="admin-alert-error">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
              placeholder="admin@balaji.com"
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label className="form-label">Password</label>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-input ${errors.password ? "error" : ""}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : "Sign In to Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
