import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import "../../theme.css";
import "./Styles/CheckOut.css";

const CheckOut = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", paymentMethod: "cod",
  });
  const navigate = useNavigate();

  // ── Load cart + auto-fill user data ──────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login first to checkout");
      navigate("/cuslogin");
      return;
    }
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length === 0) {
      toast.info("Your cart is empty");
      navigate("/cart");
      return;
    }
    setCart(storedCart.map((item) => ({ ...item, quantity: item.quantity || 1 })));

    // Auto-fill name from localStorage immediately
    const userName = localStorage.getItem("user_name");
    if (userName) setFormData((p) => ({ ...p, name: userName }));

    // Fetch full profile for phone/email
    const userId = localStorage.getItem("user_id");
    if (userId && token) {
      axios.get(`http://localhost:5000/api/user/${userId}`)
        .then((res) => {
          const u = res.data;
          setFormData((p) => ({
            ...p,
            name:  u.user_name    || p.name,
            email: u.user_email   || p.email,
            phone: u.user_contact || p.phone,
          }));
        })
        .catch(() => {}); // silently ignore — user fills manually
    }
  }, [navigate]);

  // ── Form handling ─────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())
      errs.name = "Full name is required";
    if (!formData.email.trim())
      errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Enter a valid email address";
    if (!formData.phone.trim())
      errs.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone.trim()))
      errs.phone = "Enter a valid 10-digit Indian mobile number";
    if (!formData.address.trim())
      errs.address = "Delivery address is required";
    else if (formData.address.trim().length < 10)
      errs.address = "Please enter a complete address (min 10 characters)";
    if (!formData.paymentMethod)
      errs.paymentMethod = "Please select a payment method";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

  // ── Place order in DB ─────────────────────────────────────
  const placeOrderInDB = async (paymentMode) => {
    const userId = localStorage.getItem("user_id");
    const res = await axios.post("http://localhost:5000/place-order", {
      customer_id: userId || 0,
      products: cart.map((item) => ({
        product_id: item.id,
        name:       item.name,
        price:      Number(item.price),
        quantity:   item.quantity || 1,
      })),
      total_price:    getTotalPrice(),
      name:           formData.name,
      email:          formData.email,
      phone:          formData.phone,
      address:        formData.address,
      payment_mode:   paymentMode,
    });
    return res.data;
  };

  // ── COD ───────────────────────────────────────────────────
  const handleCOD = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await placeOrderInDB("COD");
      toast.success("🎉 Order placed successfully! Pay on delivery.");
      localStorage.removeItem("cart");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Online Payment via Razorpay ───────────────────────────
  const handleOnlinePayment = async () => {
    if (!validate()) return;

    // Check Razorpay script is loaded
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded. Please use Cash on Delivery.");
      setFormData((p) => ({ ...p, paymentMethod: "cod" }));
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: getTotalPrice(),
      });

      const options = {
        key:       process.env.VITE_RAZORPAY_KEY || "rzp_test_SgPSwKkrO0I17f",
        amount:    res.data.amount,
        currency:  "INR",
        name:      "Balaji Enterprises",
        description: "Order Payment",
        order_id:  res.data.id,
        handler: async (response) => {
          try {
            await placeOrderInDB("Online");
            toast.success("🎉 Payment successful! Order placed.");
            localStorage.removeItem("cart");
            navigate("/orders");
          } catch {
            toast.error("Payment done but order save failed. Please contact support.");
          }
        },
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: "#e8400a" },
        modal: {
          ondismiss: () => { setLoading(false); },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again or use COD.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      const errMsg = err.response?.data?.error || "";
      if (errMsg.includes("not configured") || err.response?.status === 503) {
        toast.error("Online payment not configured. Switched to Cash on Delivery.");
        setFormData((p) => ({ ...p, paymentMethod: "cod" }));
      } else {
        toast.error("Payment initiation failed. Please try Cash on Delivery.");
      }
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.paymentMethod === "online") handleOnlinePayment();
    else handleCOD();
  };

  const total    = getTotalPrice();
  const totalQty = cart.reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <div className="page-wrapper">
      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <CusHeader />
      <div className="checkout-page">
        <h1 className="checkout-title">🛒 Checkout</h1>

        <div className="checkout-layout">
          {/* ── Delivery Form ── */}
          <div className="checkout-form-section">
            <div className="checkout-card">
              <h3 className="checkout-card-title">📦 Delivery Information</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="co-row">
                  <div className="co-field">
                    <label className="form-label">Full Name *</label>
                    <input
                      name="name"
                      className={`form-input ${errors.name ? "error" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className="co-field">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      name="phone"
                      className={`form-input ${errors.phone ? "error" : ""}`}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="co-field">
                  <label className="form-label">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    className={`form-input ${errors.email ? "error" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="co-field">
                  <label className="form-label">Delivery Address *</label>
                  <textarea
                    name="address"
                    className={`form-input ${errors.address ? "error" : ""}`}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House no., Street, Area, City, State, PIN code"
                    rows={3}
                    style={{ resize: "vertical" }}
                  />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div>

                <div className="co-field">
                  <label className="form-label">Payment Method *</label>
                  <div className="payment-options">
                    <label className={`payment-option ${formData.paymentMethod === "cod" ? "selected" : ""}`}>
                      <input
                        type="radio" name="paymentMethod" value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                      />
                      <span className="payment-icon">💵</span>
                      <div>
                        <strong>Cash on Delivery</strong>
                        <small>Pay when your order arrives</small>
                      </div>
                    </label>
                    <label className={`payment-option ${formData.paymentMethod === "online" ? "selected" : ""}`}>
                      <input
                        type="radio" name="paymentMethod" value="online"
                        checked={formData.paymentMethod === "online"}
                        onChange={handleChange}
                      />
                      <span className="payment-icon">💳</span>
                      <div>
                        <strong>Online Payment</strong>
                        <small>UPI, Card, Net Banking via Razorpay</small>
                      </div>
                    </label>
                  </div>
                  {errors.paymentMethod && <span className="field-error">{errors.paymentMethod}</span>}
                </div>

                <button type="submit" className="place-order-btn" disabled={loading}>
                  {loading
                    ? <span className="btn-spinner"></span>
                    : formData.paymentMethod === "online"
                      ? "💳 Pay Now"
                      : "🛍️ Place Order"}
                </button>
              </form>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="checkout-summary-section">
            <div className="checkout-card">
              <h3 className="checkout-card-title">Order Summary</h3>
              <div className="co-items-list">
                {cart.map((item, i) => (
                  <div key={i} className="co-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => { e.target.src = "http://localhost:5000/uploads/home.png"; }}
                    />
                    <div className="co-item-info">
                      <div className="co-item-name">{item.name}</div>
                      <div className="co-item-qty">Qty: {item.quantity || 1}</div>
                    </div>
                    <div className="co-item-price">
                      ₹{(Number(item.price) * (item.quantity || 1)).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="co-summary-rows">
                <div className="co-summary-row">
                  <span>Items ({totalQty})</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="co-summary-row">
                  <span>Delivery</span>
                  <span style={{ color: "#10b981", fontWeight: 600 }}>FREE</span>
                </div>
                <div className="co-summary-divider"></div>
                <div className="co-summary-total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CusFooter />
    </div>
  );
};

export default CheckOut;
