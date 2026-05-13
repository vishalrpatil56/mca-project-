require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const path = require("path");

const db = mysql.createConnection({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME     || "home_appliances_db",
});

db.connect((err) => {
  if (err) console.error("❌ productRoutes DB error:", err.message);
  else console.log("✅ productRoutes DB connected");
});

// GET single product by ID (with images if table exists)
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM product_details WHERE product_id = ?", [id], (err, productResult) => {
    if (err) return res.status(500).json({ error: "DB error: " + err.message });
    if (!productResult.length) return res.status(404).json({ message: "Product not found" });

    const product = productResult[0];

    // Try to get product images — skip if table doesn't exist
    db.query(
      "SELECT image_url FROM product_images WHERE product_id = ?",
      [id],
      (err2, imageResult) => {
        product.images = err2 ? [] : (imageResult || []);
        res.json(product);
      }
    );
  });
});

module.exports = router;
