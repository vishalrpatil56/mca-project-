import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLogOut, FiHome, FiPackage, FiMessageSquare, FiStar, FiTool } from "react-icons/fi";
import "./Style/Header1.css";

const Header1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("serviceprovider_id");
    localStorage.removeItem("userType");
    navigate("/loginpage");
  };

  const navLinks = [
    { to: "/serviceproviderdash",                    icon: <FiHome size={15} />,        label: "Dashboard"   },
    { to: "/serviceproviderdash/productdetails",      icon: <FiTool size={15} />,        label: "Products"    },
    { to: "/serviceproviderdash/customerorders",      icon: <FiPackage size={15} />,     label: "Orders"      },
    { to: "/serviceproviderdash/serviceprovidercomplain", icon: <FiMessageSquare size={15} />, label: "Complaints" },
    { to: "/serviceproviderdash/serviceproviderfeedback", icon: <FiStar size={15} />,    label: "Feedback"    },
  ];

  return (
    <header className="sp-header">
      <nav className="sp-nav">
        <Link to="/serviceproviderdash" className="sp-logo">
          <img
            src="/uploads/Untitled design.jpeg"
            alt="logo"
            className="sp-logo-img"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <span>Balaji <strong>Service Portal</strong></span>
        </Link>

        <div className="sp-nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`sp-nav-link ${isActive(link.to) ? "sp-nav-active" : ""}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>
          <Link
            to="/Adminpenal"
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              background: "#111827",
              color: "#fff",
              textDecoration: "none",
              fontWeight: "600",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "0.3s",
            }}
          >
            Admin Panel
          </Link>
        <button className="sp-logout-btn" onClick={handleLogout}>
          <FiLogOut size={15} /> Logout
        </button>
      </nav>
    </header>
  );
};

export default Header1;
