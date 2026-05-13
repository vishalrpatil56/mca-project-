import React, { useState, useEffect } from "react";
import axios from "axios";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import ProductSection from "./ProductSection";
import "../../theme.css";

const WashingM = () => {
  const [frontLoad, setFrontLoad] = useState([]);
  const [topLoad, setTopLoad] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [front, top] = await Promise.all([
          axios.get("http://localhost:5000/api/washingmachines/frontload"),
          axios.get("http://localhost:5000/api/washingmachines/topload"),
        ]);
        setFrontLoad(front.data);
        setTopLoad(top.data);
      } catch (err) {
        console.error("Error fetching washing machines:", err);
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
        <h1>🫧 <span className="banner-accent">Washing Machines</span></h1>
        <p>Front load & top load — powerful wash, energy efficient, fabric-friendly</p>
      </div>
      <div className="category-page">
        <ProductSection title="Front Load Washing Machines" products={frontLoad} loading={loading} />
        <ProductSection title="Top Load Washing Machines" products={topLoad} loading={loading} />
      </div>
      <CusFooter />
    </div>
  );
};

export default WashingM;
