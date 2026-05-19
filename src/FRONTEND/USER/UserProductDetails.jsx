import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import "../../theme.css";
import "./Styles/UserProductDetails.css";

const BASE = "http://98.85.25.190:5000";

function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE}/api/product/${id}`)
      .then((res) => {
        setProduct(res.data);
        setSelectedImage(res.data.images?.length > 0 ? res.data.images[0].image_url : res.data.product_image);
      })
      .catch(() => toast.error("Failed to load product details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login first to add items to cart");
      navigate("/cuslogin");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIdx = cart.findIndex((item) => item.id === product.product_id);
    if (existingIdx >= 0) {
      cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + 1;
    } else {
      cart.push({
        id: product.product_id,
        image: `${BASE}/uploads/${selectedImage}`,
        name: product.product_name,
        description: product.product_description,
        price: product.product_price,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`"${product.product_name}" added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) return (
    <div className="page-wrapper">
      <CusHeader />
      <div style={{ textAlign: "center", padding: 80 }}><div className="spinner" style={{ margin: "0 auto" }}></div></div>
      <CusFooter />
    </div>
  );

  if (!product) return (
    <div className="page-wrapper">
      <CusHeader />
      <div className="empty-state"><div className="empty-icon">😕</div><h3>Product not found</h3></div>
      <CusFooter />
    </div>
  );

  const imgSrc = (url) => url ? `${BASE}/uploads/${url}` : `${BASE}/uploads/home.png`;

  return (
    <div className="page-wrapper">
      <CusHeader />
      <div className="pd-page">
        <button className="pd-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} /> Back
        </button>

        <div className="pd-layout">
          {/* Image gallery */}
          <div className="pd-gallery">
            <div className="pd-main-img">
              <img src={imgSrc(selectedImage)} alt={product.product_name} onError={(e) => { e.target.src = `${BASE}/uploads/home.png`; }} />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="pd-thumbnails">
                {product.images.map((img, i) => (
                  <button key={i} className={`pd-thumb ${selectedImage === img.image_url ? "active" : ""}`} onClick={() => setSelectedImage(img.image_url)}>
                    <img src={imgSrc(img.image_url)} alt={`View ${i + 1}`} onError={(e) => { e.target.src = `${BASE}/uploads/home.png`; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="pd-info">
            <div className="pd-category">{product.category_name || "Home Appliance"}</div>
            <h1 className="pd-title">{product.product_name}</h1>
            <div className="pd-price">₹{Number(product.product_price).toLocaleString("en-IN")}</div>

            {product.product_description && (
              <p className="pd-short-desc">{product.product_description}</p>
            )}

            {product.long_description && (
              <div className="pd-long-desc">
                <h3>Product Details</h3>
                <p>{product.long_description}</p>
              </div>
            )}

            <div className="pd-features">
              <div className="pd-feature"><FiCheck className="pd-check" /><span>Genuine product with manufacturer warranty</span></div>
              <div className="pd-feature"><FiCheck className="pd-check" /><span>Free home delivery</span></div>
              <div className="pd-feature"><FiCheck className="pd-check" /><span>Professional installation available</span></div>
            </div>

            <div className="pd-actions">
              <button className={`pd-cart-btn ${added ? "added" : ""}`} onClick={handleAddToCart}>
                {added ? <><FiCheck size={18} /> Added!</> : <><AiOutlineShoppingCart size={20} /> Add to Cart</>}
              </button>
              <button className="pd-checkout-btn" onClick={() => { handleAddToCart(); setTimeout(() => navigate("/cart"), 500); }}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <CusFooter />
    </div>
  );
}

export default ProductDetails;
