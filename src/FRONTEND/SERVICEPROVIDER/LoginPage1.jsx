import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "../../theme.css";
import "./Style/Loginpage.css";

const ServiceProviderLogin = () => {
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
      const res = await fetch("/ServiceProviderLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userType", "serviceProvider");
        localStorage.setItem("serviceprovider_id", data.serviceprovider_id);
        toast.success("Login successful! Welcome back.");
        navigate("/serviceproviderdash");
      } else {
        toast.error(data.message || "Invalid credentials.");
        setErrors({ general: data.message || "Invalid email or password." });
      }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sp-auth-page">
      <div className="sp-auth-card">
        <div className="sp-auth-header">
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔧</div>
          <h1>Service Provider Login</h1>
          <p>Sign in to manage your services and orders</p>
        </div>

        {errors.general && <div className="auth-alert auth-alert-error">{errors.general}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="form-label">Email Address</label>
            <input
              type="email" className={`form-input ${errors.email ? "error" : ""}`}
              value={email} onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: ""})); }}
              placeholder="your@email.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label className="form-label">Password</label>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-input ${errors.password ? "error" : ""}`}
                value={password} onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: ""})); }}
                placeholder="Enter your password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : "Sign In"}
          </button>
        </form>

        <p className="auth-link-text" style={{ marginTop: 16 }}>
          Not registered? <Link to="/registrationpage" className="auth-link">Create account</Link>
        </p>
        <p className="auth-link-text">
          <Link to="/" className="auth-link" style={{ color: "#6b7280" }}>← Back to Store</Link>
        </p>
      </div>
    </div>
  );
};

export default ServiceProviderLogin;
