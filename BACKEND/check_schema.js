/**
 * Run this to see your actual database schema and subcategory names:
 *   node check_schema.js
 * 
 * This helps debug why products might not show on the website.
 */
require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME     || "home_appliances_db",
});

db.connect((err) => {
  if (err) {
    console.error("\n❌ Cannot connect to MySQL:", err.message);
    console.log("\n👉 Check your BACKEND/.env file — make sure DB_PASSWORD is correct\n");
    process.exit(1);
  }
  console.log("✅ Connected to:", process.env.DB_NAME || "home_appliances_db");
  console.log("=".repeat(60));
  runChecks();
});

function runChecks() {
  // 1. Check product_order columns
  db.query("DESCRIBE product_order", (err, rows) => {
    if (err) {
      console.log("\n⚠️  product_order table:", err.message);
    } else {
      console.log("\n📋 product_order columns:");
      rows.forEach(r => console.log(`   - ${r.Field} (${r.Type})`));
    }

    // 2. Check subcategory names (most important for product display)
    db.query("SELECT p_subcata_id, p_sub_cata_name, p_cata_id FROM product_sub_category ORDER BY p_cata_id", (err, rows) => {
      if (err) {
        console.log("\n⚠️  product_sub_category:", err.message);
      } else {
        console.log("\n🏷️  Subcategory names in your DB (these must match server.js exactly):");
        rows.forEach(r => console.log(`   ID ${r.p_subcata_id} | Cat ${r.p_cata_id} | "${r.p_sub_cata_name}"`));

        const expected = [
          "LED", "QLED",
          "Top Load", "Front Load",
          "Split AC", "Window AC",
          "Single Door", "Double Door", "Tripple Door", "Side-by-side Door",
          "RO Water Purifier"
        ];
        const actual = rows.map(r => r.p_sub_cata_name);
        const missing = expected.filter(e => !actual.includes(e));
        if (missing.length > 0) {
          console.log("\n⚠️  These expected subcategory names are NOT in your DB:");
          missing.forEach(m => console.log(`   ❌ "${m}"`));
          console.log('\n👉 Either rename them in MySQL OR update the productQuery() calls in server.js to match your actual names');
        } else {
          console.log("\n✅ All expected subcategory names found!");
        }
      }

      // 3. Count products
      db.query("SELECT COUNT(*) AS total FROM product_details", (err, rows) => {
        if (!err) console.log(`\n📦 Total products in DB: ${rows[0].total}`);

        // 4. Check product images
        db.query("SELECT COUNT(*) AS total FROM product_details WHERE product_image IS NOT NULL AND product_image != ''", (err, rows) => {
          if (!err) console.log(`🖼️  Products with images: ${rows[0].total}`);

          // 5. Count orders
          db.query("SELECT COUNT(*) AS total FROM product_order", (err, rows) => {
            if (!err) console.log(`🛒 Total orders: ${rows[0].total}`);

            console.log("\n" + "=".repeat(60));
            console.log("Done. Fix any issues above, then restart server.\n");
            db.end();
          });
        });
      });
    });
  });
}
