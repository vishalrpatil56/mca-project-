import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import "../../theme.css";
import "./Styles/CusHome.css";

const BASE = "";

const slides = [
  { image: `${BASE}/uploads/Ac.png`, label: "Air Conditioners", sub: "Stay cool with inverter technology ACs", link: "/aircon" },
  { image: `${BASE}/uploads/Machine.png`, label: "Washing Machines", sub: "Energy efficient front & top load washers", link: "/washing" },
  { image: `${BASE}/uploads/Tv.png`, label: "Televisions", sub: "Stunning 4K QLED & LED displays", link: "/telivision" },
];

const categories = [
  { name: "Washing Machines", img: `${BASE}/uploads/washingmachine.png`, link: "/washing", emoji: "🫧" },
  { name: "Air Conditioners", img: `${BASE}/uploads/air.png`, link: "/aircon", emoji: "❄️" },
  { name: "Refrigerators", img: `${BASE}/uploads/ref.png`, link: "/fridge", emoji: "🧊" },
  { name: "Televisions", img: `${BASE}/uploads/tel.png`, link: "/telivision", emoji: "📺" },
  { name: "Water Purifiers", img: `${BASE}/uploads/ro.png`, link: "/waterpurifier", emoji: "💧" },
];

const features = [
  { icon: "🚚", title: "Free Delivery", desc: "On all orders across India" },
  { icon: "🔧", title: "Expert Installation", desc: "By certified technicians" },
  { icon: "🛡️", title: "Genuine Warranty", desc: "Manufacturer warranty on all products" },
  { icon: "💳", title: "Secure Payment", desc: "Razorpay & COD available" },
];

const CusHome = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <CusHeader />

      {/* Hero Carousel */}
      <div className="hero-slider">
        <Swiper modules={[Navigation, Pagination, Autoplay]} navigation pagination={{ clickable: true }} autoplay={{ delay: 3500 }} loop className="hero-swiper">
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="hero-slide">
                <div className="hero-slide-bg">
                  <img src={slide.image} alt={slide.label} className="hero-slide-img" />
                </div>
                <div className="hero-slide-content">
                  <h2 className="hero-label">{slide.label}</h2>
                  <p className="hero-sub">{slide.sub}</p>
                  <Link to={slide.link} className="hero-cta">Shop Now →</Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Features strip */}
      <div className="features-strip">
        <div className="features-container">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="home-section">
        <div className="home-container">
          <div className="section-heading-wrap">
            <div className="section-divider"></div>
            <h2 className="section-heading">Featured <span>Categories</span></h2>
            <p className="section-subheading">Choose from our wide range of premium home appliances</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <div key={i} className="category-card" onClick={() => navigate(cat.link)}>
                <div className="category-card-img">
                  <img src={cat.img} alt={cat.name} onError={(e) => { e.target.style.display = "none"; }} />
                </div>
                <div className="category-card-name">
                  <span>{cat.emoji}</span> {cat.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Support Section */}
<div className="support-section">
  <div className="home-container">
    <div className="support-card">
      <div>
        <h2>Need Help or Want to Share Feedback?</h2>
        <p>
          Submit complaints, report issues, or share your valuable feedback
          with us.
        </p>
      </div>

      <div className="support-buttons">
        <Link to="/cuscomplain" className="support-btn complaint-btn">
          📋 Submit Complaint
        </Link>

        <Link to="/cusfeedback" className="support-btn feedback-btn">
          ⭐ Give Feedback
        </Link>
      </div>
    </div>
  </div>
</div>

      {/* CTA Banner */}
      <div className="cta-banner">
        <div className="cta-content">
          <h2>Looking for a Service Provider?</h2>
          <p>Get expert installation, repair, and maintenance services at your doorstep</p>
          <Link to="/loginpage" className="cta-btn">Become a Service Partner →</Link>
        </div>
      </div>

      <CusFooter />
    </div>
  );
};

export default CusHome;
