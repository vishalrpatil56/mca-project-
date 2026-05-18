import React, { useState, useEffect } from "react";
import axios from "axios";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import ProductSection from "./ProductSection";
import "../../theme.css";

const AirCon = () => {
  const [split, setSplit] = useState([]);
  const [window_, setWindow_] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, w] = await Promise.all([
          axios.get("http://98.85.25.190:5000/api/airconditioners/split"),
          axios.get("http://98.85.25.190:5000/api/airconditioners/window"),
        ]);
        setSplit(s.data);
        setWindow_(w.data);
      } catch (err) {
        console.error("Error fetching ACs:", err);
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
        <h1>❄️ <span className="banner-accent">Air Conditioners</span></h1>
        <p>Split & window ACs — energy star rated, fast cooling, smart controls</p>
      </div>
      <div className="category-page">
        <ProductSection title="Split Air Conditioners" products={split} loading={loading} />
        <ProductSection title="Window Air Conditioners" products={window_} loading={loading} />
      </div>
      <CusFooter />
    </div>
  );
};

export default AirCon;
