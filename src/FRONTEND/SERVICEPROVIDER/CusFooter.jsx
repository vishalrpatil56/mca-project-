import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import "./Style/CusFooter.css"; // Custom styles


const CusFooter = () => {
  return (
    <footer className="footer mt-5">
      <div className="container py-4">
        <div className="row">
          {/* USEFUL LINKS */}
          <div className="col-md-2">
            <h6 className="footer-title">USEFUL LINKS</h6>
            <ul className="footer-list">
              <li><a href="/cushome">Home</a></li>
              <li><a href="#">About Us</a></li>
              {/* <li><a href="#">Store Location</a></li>
              <li><a href="#">Career</a></li>
              <li><a href="#">Bank Detail</a></li>
              <li><a href="#">Contact Us</a></li> */}
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className="col-md-3">
            <h6 className="footer-title">CATEGORIES</h6>
            <ul className="footer-list">
              {/* <li><a href="#">Mobiles, Laptops & Accessories</a></li> */}
              <li><a href="/aircon">Air Coolings</a></li>
              <li><a href="/washing">Washing Machines & Dishwasher</a></li>
              <li><a href="/fridge">Refrigerators</a></li>
              {/* <li><a href="#">Home Appliances</a></li> */}
              <li><a href="/telivision">Televisions</a></li>
              {/* <li><a href="#">Microwave Ovens</a></li>
              <li><a href="#">Hot Deals</a></li> */}
            </ul>
          </div>

          {/* MY ACCOUNT */}
          <div className="col-md-2">
            <h6 className="footer-title">MY ACCOUNT</h6>
            <ul className="footer-list">
              <li><a href="#">My Account</a></li>
              <li><a href="#">My Orders</a></li>
              <li><a href="/cart">Cart</a></li>
              {/* <li><a href="#">My Wishlist</a></li>
              <li><a href="#">My Coupons</a></li>
              <li><a href="#">My Invoice</a></li>
              <li><a href="#">My Complaints</a></li> */}
            </ul>
          </div>

          {/* HELP DESK */}
          <div className="col-md-2">
            <h6 className="footer-title">HELP DESK</h6>
            <ul className="footer-list">
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Help / FAQ</a></li>
            </ul>
          </div>

          {/* CUSTOMER CARE */}
          <div className="col-md-3">
            <h6 className="footer-title">CUSTOMER CARE</h6>
            <p className="footer-contact"><strong>+91 8123892151</strong></p>
            <p> Balaji Enterprise<br /> [ Mon to Sat: 10:00 AM To 6:00 PM ]</p>
            <h6 className="footer-title mt-3">FOLLOW US ON</h6>
            <div className="social-icons">
            <a href="https://facebook.com" className="text-light fs-4">
              <FaFacebook style={{ color: "blue", fontSize: "30px" }} />
            </a>
              
             
              <a href="https://instagram.com" className="text-light fs-4">
              <FaInstagram
                style={{
                  fontSize: "30px",
                  background: "linear-gradient(to right, #8a3abf, #e1306c, #f58529, #f7b731)",
                  borderRadius: "10px",
                  display: "inline-block",
                }}
              />
            </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CusFooter;
