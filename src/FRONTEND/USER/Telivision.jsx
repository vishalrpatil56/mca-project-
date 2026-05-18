import React, { useState, useEffect } from "react";
import axios from "axios";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import ProductSection from "./ProductSection";
import "../../theme.css";

const Telivision = () => {
  const [ledProducts, setLedProducts] = useState([]);
  const [qledProducts, setQledProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [led, qled] = await Promise.all([
          axios.get("http://98.85.25.190:5000/api/televisions/led"),
          axios.get("http://98.85.25.190:5000/api/televisions/qled"),
        ]);
        setLedProducts(led.data);
        setQledProducts(qled.data);
      } catch (err) {
        console.error("Error fetching televisions:", err);
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
        <h1>📺 <span className="banner-accent">Televisions</span></h1>
        <p>LED & QLED TVs — crystal clear picture, immersive sound, smart features</p>
      </div>
      <div className="category-page">
        <ProductSection title="LED Televisions" products={ledProducts} loading={loading} />
        <ProductSection title="QLED Televisions" products={qledProducts} loading={loading} />
      </div>
      <CusFooter />
    </div>
  );
};

export default Telivision;
