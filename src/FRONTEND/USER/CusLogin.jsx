import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import "../../theme.css";
import "./Styles/userLoginpage.css";

const CusLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("user_name", response.data.user_name);
        toast.success(`Welcome back, ${response.data.user_name}!`);
        navigate("/");
      } else {
        toast.error(response.data.message || "Login failed");
        setErrors({ general: response.data.message });
      }
    } catch {
      toast.error("Invalid email or password. Please try again.");
      setErrors({ general: "Invalid credentials. Check your email and password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CusHeader />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon">🔐</div>
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Sign in to your account to continue shopping</p>
            </div>

            {errors.general && (
              <div className="auth-alert auth-alert-error">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label className="form-label">Email Address</label>
                <input
                  type="email" className={`form-input ${errors.email ? "error" : ""}`}
                  value={email} onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: ""})); }}
                  placeholder="you@example.com" autoComplete="email"
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
                    placeholder="Enter your password" autoComplete="current-password"
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

            <p className="auth-link-text">
              Don't have an account? <Link to="/userregister" className="auth-link">Create one here</Link>
            </p>
          </div>

          <div className="auth-info-panel">
            <div className="auth-info-content">
              <h2>Shop Smart, Live Better</h2>
              <p>Join thousands of happy customers who trust Balaji Enterprises for their home appliance needs.</p>
              <ul className="auth-benefits">
                <li>✅ Premium quality products</li>
                <li>✅ Genuine warranty coverage</li>
                <li>✅ Expert installation service</li>
                <li>✅ Easy returns & exchange</li>
                <li>✅ Secure online payments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <CusFooter />
    </>
  );
};

export default CusLogin;
