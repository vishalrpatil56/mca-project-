import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogOut, FiHome, FiUsers, FiTool, FiTag, FiMessageSquare, FiStar } from "react-icons/fi";
import "./Style/Header.css";

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <>
      <header className="header">
        <nav className="navbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/uploads/Untitled design.jpeg"
              alt="logo"
              className="navbar-logo"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <span className="navbar-title">ADMIN PANEL</span>
          </div>
          <ul className="navbar-links">
            <li>
              <Link className="nav-link" to="/">
                🏪 Store
              </Link>
            </li>
            <li>
              <Link className="nav-link" to="/Adminpenal" title="Logout">
                <FiLogOut size={20} style={{ color: "#ef4444" }} />
                <span style={{ color: "#ef4444", marginLeft: 4 }}>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <aside className="sidebar">
        <div className="sidebar-section-title">Dashboard</div>
        <ul className="sidebar-links">
          <li>
            <Link to="/AdminDashboard" className={isActive("/AdminDashboard")}>
              <FiHome size={15} /> Dashboard
            </Link>
          </li>
        </ul>

        <div className="sidebar-section-title">Management</div>
        <ul className="sidebar-links">
          <li>
            <Link to="/customerlist" className={isActive("/customerlist")}>
              <FiUsers size={15} /> Customers
            </Link>
          </li>
          <li>
            <Link to="/serviceproviderlist" className={isActive("/serviceproviderlist")}>
              <FiTool size={15} /> Service Providers
            </Link>
          </li>
          <li>
            <Link to="/categorylist" className={isActive("/categorylist")}>
              <FiTag size={15} /> Categories & Products
            </Link>
          </li>
        </ul>

        <div className="sidebar-section-title">Reports</div>
        <ul className="sidebar-links">
          <li>
            <Link to="/complainlist" className={isActive("/complainlist")}>
              <FiMessageSquare size={15} /> Complaints
            </Link>
          </li>
          <li>
            <Link to="/feedbacklist" className={isActive("/feedbacklist")}>
              <FiStar size={15} /> Feedback
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Header;
