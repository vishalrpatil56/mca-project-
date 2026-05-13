import React from "react";
import { Link } from "react-router-dom";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import "../../theme.css";

function NotFound() {
  return (
    <div className="page-wrapper">
      <CusHeader />
      <div className="empty-state" style={{ padding: "80px 24px" }}>
        <div className="empty-icon">🔍</div>
        <h3 style={{ fontSize: 28 }}>404 — Page Not Found</h3>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary-custom" style={{ textDecoration: "none", display: "inline-block" }}>
          ← Back to Home
        </Link>
      </div>
      <CusFooter />
    </div>
  );
}

export default NotFound;
