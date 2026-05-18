import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import { AiOutlineDelete } from "react-icons/ai";
import { FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import "../../theme.css";
import "./Styles/Cart.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored.map((item) => ({ ...item, quantity: item.quantity || 1 })));
  }, []);

  const saveCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleQuantityChange = (index, delta) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty < 1) { toast.info("Minimum quantity is 1"); return; }
    updated[index].quantity = newQty;
    saveCart(updated);
  };

  const handleRemove = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    saveCart(updated);
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    if (!window.confirm("Clear your entire cart?")) return;
    saveCart([]);
    toast.info("Cart cleared");
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login first to checkout");
      navigate("/cuslogin");
      return;
    }
    if (cart.length === 0) { toast.error("Your cart is empty"); return; }
    navigate("/checkout");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="page-wrapper">
      <CusHeader />
      <div className="cart-page">
        <div className="cart-header">
          <h1>🛒 Shopping Cart</h1>
          {cart.length > 0 && <span className="cart-count-badge">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>}
        </div>

        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet. Explore our categories!</p>
            <button className="btn-primary-custom" onClick={() => navigate("/")}>
              <FiArrowLeft style={{ marginRight: 8 }} /> Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item-card">
                  <div className="cart-item-img">
                    <img src={item.image} alt={item.name} onError={(e) => { e.target.src = "http://98.85.25.190:5000/uploads/home.png"; }} />
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">₹{Number(item.price).toLocaleString("en-IN")}</div>
                  </div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => handleQuantityChange(index, -1)} disabled={item.quantity <= 1}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleQuantityChange(index, 1)}>+</button>
                  </div>
                  <div className="cart-item-total">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                  <button className="cart-remove-btn" onClick={() => handleRemove(index)} title="Remove">
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
              ))}
              <button className="clear-cart-btn" onClick={handleClearCart}>Clear Cart</button>
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-row"><span>Items ({totalItems})</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
              <div className="summary-row"><span>Delivery</span><span className="free-tag">FREE</span></div>
              <div className="summary-divider"></div>
              <div className="summary-total"><span>Total</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
              <button className="checkout-btn" onClick={handleCheckout}>
                <FiShoppingBag size={18} /> Proceed to Checkout
              </button>
              <button className="continue-btn" onClick={() => navigate("/")}>
                <FiArrowLeft size={16} /> Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
      <CusFooter />
    </div>
  );
};

export default CartPage;
