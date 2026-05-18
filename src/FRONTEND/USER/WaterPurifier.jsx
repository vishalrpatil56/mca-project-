import React, { useState, useEffect } from "react";
import axios from "axios";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import ProductSection from "./ProductSection";
import "../../theme.css";

const WaterPurifier = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("http://98.85.25.190:5000/api/waterpurifiers");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching water purifiers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="page-wrapper">
      <CusHeader />
      <div className="page-banner">
        <h1>💧 <span className="banner-accent">Water Purifiers</span></h1>
        <p>RO, UV & gravity purifiers — safe drinking water for your family</p>
      </div>
      <div className="category-page">
        <ProductSection title="RO Water Purifiers" products={products} loading={loading} />
      </div>
      <CusFooter />
    </div>
  );
};

export default WaterPurifier;
