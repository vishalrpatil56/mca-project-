import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./Styles/CusFooter.css";

const CusFooter = () => {
  return (
    <footer className="cus-footer">
      <div className="footer-top">
        <div className="footer-container">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="http://localhost:5000/uploads/Untitled design.jpeg" alt="Balaji Enterprises" onError={(e) => { e.target.style.display="none"; }} />
              <span>Balaji<strong>Enterprises</strong></span>
            </div>
            <p className="footer-tagline">Your trusted partner for premium home appliances. Quality products, expert service, unbeatable prices.</p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link facebook"><FaFacebook /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link instagram"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-link youtube"><FaYoutube /></a>
            </div>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/washing">Washing Machines</Link></li>
              <li><Link to="/aircon">Air Conditioners</Link></li>
              <li><Link to="/fridge">Refrigerators</Link></li>
              <li><Link to="/telivision">Televisions</Link></li>
              <li><Link to="/waterpurifier">Water Purifiers</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/cuslogin">Login</Link></li>
              <li><Link to="/userregister">Register</Link></li>
              <li><Link to="/loginpage">Service Provider</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact Us</h4>

            <ul className="footer-contact-list">
              <li>
                <FaPhone className="contact-icon" />
                <span>
                  +91 8123892151
                </span>
              </li>

              <li>
                <FaEnvelope className="contact-icon" />
                <span>np65925603@gmail.com</span>
              </li>

              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>Green Park, Nipani</span>
              </li>
              <li>
              <div style={{ marginTop: "18px" }}>
    <p className="footer-service-extra">
      <strong>Technicians:</strong><br />
      Nilesh Patil<br />
      Vikas Patil
    </p>

    <p className="footer-service-extra">
      <strong>Service Contacts:</strong><br />
      8123892151<br />
      7338121244
    </p>
  </div></li>
            </ul>

 
        </div>
      
      </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} Balaji Enterprises. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Help / FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CusFooter;
