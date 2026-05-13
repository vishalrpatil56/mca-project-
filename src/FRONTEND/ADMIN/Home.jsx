import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import "./Style/Home.css";

function Home() {
  const [stats, setStats] = useState({ customers: 0, providers: 0, orders: 0, complaints: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axios.get("http://localhost:5000/customerslist"),
      axios.get("http://localhost:5000/serviceproviderslist"),
      axios.get("http://localhost:5000/get-orders"),
      axios.get("http://localhost:5000/complainlist"),
    ]).then(([c, sp, o, comp]) => {
      setStats({
        customers: c.status === "fulfilled" ? (c.value.data?.length || 0) : 0,
        providers: sp.status === "fulfilled" ? (sp.value.data?.length || 0) : 0,
        orders: o.status === "fulfilled" ? (o.value.data?.orders?.length || 0) : 0,
        complaints: comp.status === "fulfilled" ? (comp.value.data?.length || 0) : 0,
      });
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Customers", value: stats.customers, icon: "👥", color: "#3b82f6", link: "/customerlist" },
    { label: "Service Providers", value: stats.providers, icon: "🔧", color: "#10b981", link: "/serviceproviderlist" },
    { label: "Total Orders", value: stats.orders, icon: "📦", color: "#e8400a", link: "/get-orders" },
    { label: "Complaints", value: stats.complaints, icon: "📋", color: "#f59e0b", link: "/complainlist" },
  ];

  const quickLinks = [
    { label: "Manage Customers", icon: "👥", link: "/customerlist", desc: "View and manage customer accounts" },
    { label: "Service Providers", icon: "🔧", link: "/serviceproviderlist", desc: "Manage service partner accounts" },
    { label: "Categories & Products", icon: "🏷️", link: "/categorylist", desc: "Add, edit and delete product categories" },
    { label: "Complaints", icon: "📋", link: "/complainlist", desc: "Review and resolve customer complaints" },
    { label: "Feedback", icon: "⭐", link: "/feedbacklist", desc: "View customer feedback and ratings" },
  ];

  return (
    <>
      <Header />
      <div className="main-content">
        {/* Welcome */}
        <div className="admin-welcome">
          <div>
            <h1>Welcome to Admin Panel 👋</h1>
            <p>Balaji Enterprises — Home Appliances &amp; Services</p>
          </div>
          <div className="admin-date">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
        </div>

        {/* Stat Cards */}
        <div className="admin-stats">
          {cards.map((card, i) => (
            <div key={i} className="admin-stat-card" style={{ borderTop: `3px solid ${card.color}` }}>
              <div className="stat-icon" style={{ background: card.color + "18" }}>{card.icon}</div>
              <div className="stat-val" style={{ color: card.color }}>
                {loading ? "..." : card.value}
              </div>
              <div className="stat-label">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <h2 className="admin-section-title">Quick Navigation</h2>
        <div className="admin-quick-links">
          {quickLinks.map((q, i) => (
            <a key={i} href={q.link} className="quick-link-card">
              <div className="ql-icon">{q.icon}</div>
              <div className="ql-label">{q.label}</div>
              <div className="ql-desc">{q.desc}</div>
              <div className="ql-arrow">→</div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
