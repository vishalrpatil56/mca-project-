import React, { useState, useEffect } from "react";
import axios from "axios";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import ProductSection from "./ProductSection";
import "../../theme.css";

const Fridge = () => {
  const [single, setSingle] = useState([]);
  const [double, setDouble] = useState([]);
  const [side, setSide] = useState([]);
  const [triple, setTriple] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, d, sb, t] = await Promise.all([
          axios.get("http://localhost:5000/api/refrigerators/singledoor"),
          axios.get("http://localhost:5000/api/refrigerators/doubledoor"),
          
        ]);
        setSingle(s.data); setDouble(d.data); setSide(sb.data); setTriple(t.data);
      } catch (err) {
        console.error("Error fetching refrigerators:", err);
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
        <h1>🧊 <span className="banner-accent">Refrigerators</span></h1>
        <p>Single, double, triple door & side-by-side — keep fresh, stay organized</p>
      </div>
      <div className="category-page">
        <ProductSection title="Single Door Refrigerators" products={single} loading={loading} />
        <ProductSection title="Double Door Refrigerators" products={double} loading={loading} />
        
      </div>
      <CusFooter />
    </div>
  );
};

export default Fridge;
