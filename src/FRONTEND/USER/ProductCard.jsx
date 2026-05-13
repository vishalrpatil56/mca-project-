import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiInfo } from "react-icons/fi";
import { toast } from "react-toastify";
import "../../theme.css";

const BASE_URL = "http://localhost:5000";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login first to add items to cart");
      navigate("/cuslogin");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Prevent duplicates — increase quantity instead
    const existingIdx = cart.findIndex((item) => item.id === product.product_id);
    if (existingIdx >= 0) {
      cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + 1;
    } else {
      cart.push({
        id: product.product_id,
        image: `${BASE_URL}/uploads/${product.product_image}`,
        name: product.product_name,
        description: product.product_description,
        price: product.product_price,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`"${product.product_name}" added to cart!`);
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.product_id}`);
  };

  const imageUrl = product.product_image
    ? `${BASE_URL}/uploads/${product.product_image}`
    : `${BASE_URL}/uploads/home.png`;

  return (
    <div className="product-card">
      <div className="card-img-wrapper">
        <img
          src={imageUrl}
          alt={product.product_name}
          onError={(e) => { e.target.src = `${BASE_URL}/uploads/home.png`; }}
        />
      </div>
      <div className="card-body">
        <div className="card-title">{product.product_name}</div>
        <div className="card-price">₹{Number(product.product_price).toLocaleString("en-IN")}</div>
        <div className="card-description">{product.product_description}</div>
        <div className="card-actions">
          <button className="btn-cart" onClick={handleAddToCart}>
            <AiOutlineShoppingCart size={16} /> Add to Cart
          </button>
          <button className="btn-details" onClick={handleViewDetails} title="View Details">
            <FiInfo size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
