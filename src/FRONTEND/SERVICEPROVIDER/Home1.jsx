import React from "react";
import Header from "./Header1";
import "../../theme.css";
import "./Style/Home1.css";

const Home1 = () => {
  const stats = [
    { icon: "📦", label: "Manage Products", desc: "Add, edit and delete products", link: "/serviceproviderdash/productdetails" },
    { icon: "🛒", label: "Customer Orders", desc: "View and manage all orders", link: "/serviceproviderdash/customerorders" },
    { icon: "📋", label: "Complaints", desc: "Submit and track complaints", link: "/serviceproviderdash/serviceprovidercomplain" },
    { icon: "⭐", label: "Feedback", desc: "Submit feedback and ratings", link: "/serviceproviderdash/serviceproviderfeedback" },
  ];

  return (
    <>
      <Header />
      <div className="sp-dashboard">
        <div className="sp-welcome">
          <h1>Welcome, Service Partner 👋</h1>
          <p>Manage your products, orders, and customer interactions from here.</p>
        </div>

        <div className="sp-hero-img">
          <img
            src="http://localhost:5000/uploads/6424688.webp"
            alt="Appliances"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>

        <h2 className="sp-section-title">Quick Actions</h2>
        <div className="sp-quick-grid">
          {stats.map((s, i) => (
            <a key={i} href={s.link} className="sp-quick-card">
              <div className="sp-quick-icon">{s.icon}</div>
              <div className="sp-quick-label">{s.label}</div>
              <div className="sp-quick-desc">{s.desc}</div>
              <div className="sp-quick-arrow">→</div>
            </a>
          ))}
        </div>

        <div className="sp-why">
          <h2>Why Choose Balaji Enterprises?</h2>
          <div className="sp-why-grid">
            {[
              { icon: "⚡", title: "Fast Services", desc: "Same-day and next-day service options" },
              { icon: "💯", title: "Best Prices", desc: "Competitive rates for all services" },
              { icon: "🔧", title: "Expert Technicians", desc: "Certified professionals for every job" },
              { icon: "🛡️", title: "Guaranteed Work", desc: "All work backed by service warranty" },
            ].map((w, i) => (
              <div key={i} className="sp-why-card">
                <div className="sp-why-icon">{w.icon}</div>
                <div className="sp-why-title">{w.title}</div>
                <div className="sp-why-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home1;
