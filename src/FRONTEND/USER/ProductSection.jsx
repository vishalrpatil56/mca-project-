import React from "react";
import ProductCard from "./ProductCard";
import "../../theme.css";

// Reusable section for a group of products
const ProductSection = ({ title, products, loading }) => {
  if (loading) {
    return (
      <div className="product-section">
        <div className="section-heading">{title}</div>
        <div className="products-grid">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="product-card skeleton-card">
              <div className="skeleton-img"></div>
              <div className="skeleton-body">
                <div className="skeleton-line long"></div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-section">
        <div className="section-heading">{title}</div>
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No products available</h3>
          <p>Check back soon — new products are added regularly!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-section">
      <div className="section-heading-wrap">
        <div className="section-divider"></div>
        <h2 className="section-heading">{title}</h2>
        <p className="section-subheading">{products.length} product{products.length !== 1 ? "s" : ""} available</p>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
