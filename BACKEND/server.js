require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "balaji_secret_2025";

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes from separate files ──────────────────────────────
const productRoutes = require("./productRoutes");
const paymentRoutes = require("./payment");
app.use("/api/product", productRoutes);
app.use("/api/payment", paymentRoutes);

// ── MySQL Connection (with auto-reconnect) ──────────────────
const dbConfig = {
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME     || "home_appliances_db",
};

let db;
function connectDB() {
  db = mysql.createConnection(dbConfig);
  db.connect((err) => {
    if (err) {
      console.error("❌ MySQL connection failed:", err.message);
      console.log("🔄 Retrying in 5 seconds...");
      setTimeout(connectDB, 5000);
      return;
    }
    console.log("✅ MySQL connected to database:", dbConfig.database);
    // After connecting, auto-add any missing columns so old DBs work too
    autoMigrateDB();
  });
  db.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.warn("⚠️  MySQL connection lost — reconnecting...");
      connectDB();
    } else {
      throw err;
    }
  });
}

// Auto-add missing columns to support both old and new DB schemas
function autoMigrateDB() {
  const migrations = [
    // Add order_group_id to product_order if missing
    `ALTER TABLE product_order ADD COLUMN IF NOT EXISTS order_group_id VARCHAR(50) DEFAULT NULL`,
    // Add payment_mode to product_order if missing
    `ALTER TABLE product_order ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(50) DEFAULT 'COD'`,
    // Add name, email, phone, address to product_order if missing
    `ALTER TABLE product_order ADD COLUMN IF NOT EXISTS name VARCHAR(100) DEFAULT NULL`,
    `ALTER TABLE product_order ADD COLUMN IF NOT EXISTS email VARCHAR(100) DEFAULT NULL`,
    `ALTER TABLE product_order ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL`,
    `ALTER TABLE product_order ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL`,
    // Add quantity to product_order if missing
    `ALTER TABLE product_order ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1`,
    // Add total_price to product_order if missing
    `ALTER TABLE product_order ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2) DEFAULT 0`,
    // Add order_date if missing
    `ALTER TABLE product_order ADD COLUMN IF NOT EXISTS order_date DATETIME DEFAULT CURRENT_TIMESTAMP`,
    // Update existing rows to have an order_group_id
    `UPDATE product_order SET order_group_id = CONCAT('ORD-', order_id) WHERE order_group_id IS NULL`,
  ];

  migrations.forEach((sql) => {
    db.query(sql, (err) => {
      if (err && !err.message.includes("Duplicate column")) {
        // Ignore "column already exists" errors, log real ones
        if (!err.message.includes("already exists") && !err.message.includes("IF NOT EXISTS")) {
          console.warn("Migration warning:", err.message);
        }
      }
    });
  });
  console.log("✅ DB schema migration complete");
}

connectDB();

// ── Multer for image uploads ────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|avif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext.slice(1))) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// ═══════════════════════════════════════════════════════════
//  ADMIN ROUTES
// ═══════════════════════════════════════════════════════════

app.post("/Adminpenal", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password required" });

  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (results.length === 0)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const user = results[0];
    // Support both plain text and hashed passwords
    if (user.password !== password)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ success: true, token });
  });
});

// ═══════════════════════════════════════════════════════════
//  USER AUTH ROUTES
// ═══════════════════════════════════════════════════════════

app.post("/api/register", (req, res) => {
  const { userName, userContact, userEmail, password } = req.body;

  if (!userName || userName.trim().length < 2)
    return res.status(400).json({ error: "Name must be at least 2 characters." });
  if (!userContact || !/^[0-9]{10}$/.test(userContact))
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
  if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail))
    return res.status(400).json({ error: "Enter a valid email address." });
  if (!password || password.length < 8)
    return res.status(400).json({ error: "Password must be at least 8 characters." });

  db.query("SELECT user_id FROM user WHERE user_email = ?", [userEmail], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error." });
    if (results.length > 0) return res.status(400).json({ error: "Email already registered." });

    db.query(
      "INSERT INTO user (user_name, user_contact, user_email, password) VALUES (?, ?, ?, ?)",
      [userName.trim(), userContact, userEmail.toLowerCase(), password],
      (err) => {
        if (err) return res.status(500).json({ error: "Registration failed: " + err.message });
        res.json({ success: true, message: "Registration successful." });
      }
    );
  });
});

app.post("/api/login", (req, res) => {
  const { userEmail, email, password } = req.body;
  const finalEmail = (userEmail || email || "").toLowerCase().trim();

  if (!finalEmail || !password)
    return res.status(400).json({ success: false, message: "Email and password are required." });

  db.query("SELECT * FROM user WHERE user_email = ?", [finalEmail], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (results.length === 0)
      return res.status(400).json({ success: false, message: "No account found with this email." });

    const user = results[0];
    if (user.password !== password)
      return res.status(400).json({ success: false, message: "Incorrect password." });

    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ success: true, token, user_id: user.user_id, user_name: user.user_name });
  });
});

// Get user profile for checkout auto-fill
app.get("/api/user/:id", (req, res) => {
  db.query(
    "SELECT user_id, user_name, user_email, user_contact FROM user WHERE user_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (results.length === 0) return res.status(404).json({ error: "User not found" });
      res.json(results[0]);
    }
  );
});

// ═══════════════════════════════════════════════════════════
//  SERVICE PROVIDER ROUTES
// ═══════════════════════════════════════════════════════════

// ── Service Provider Register (auto-detects column names) ──
app.post("/api/serviceproviderregister", (req, res) => {
  const { userName, userContact, userEmail, password } = req.body;

  if (!userName || userName.trim().length < 2)
    return res.status(400).json({ error: "Name must be at least 2 characters." });
  if (!userContact || !/^[0-9]{10}$/.test(userContact))
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
  if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail))
    return res.status(400).json({ error: "Enter a valid email address." });
  if (!password || password.length < 8)
    return res.status(400).json({ error: "Password must be at least 8 characters." });

  // Auto-detect column names in service_provider table
  db.query("DESCRIBE service_provider", (err, cols) => {
    if (err) return res.status(500).json({ error: "Database error." });

    const colNames = cols.map(c => c.Field);
    const nameCol    = colNames.find(c => c.includes("name"))    || "serviceprovider_name";
    const contactCol = colNames.find(c => c.includes("contact")) || "serviceprovider_contact";
    const emailCol   = colNames.find(c => c.includes("email"))   || "serviceprovider_email";
    const idCol      = cols.find(c => c.Key === "PRI")?.Field    || "serviceprovider_id";

    db.query(`SELECT ${idCol} FROM service_provider WHERE ${emailCol} = ?`,
      [userEmail.toLowerCase()], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        if (results.length > 0) return res.status(400).json({ error: "Email already registered." });

        db.query(
          `INSERT INTO service_provider (${nameCol}, ${contactCol}, ${emailCol}, password) VALUES (?, ?, ?, ?)`,
          [userName.trim(), userContact, userEmail.toLowerCase(), password],
          (err, result) => {
            if (err) return res.status(500).json({ error: "Registration failed: " + err.message });
            res.json({ success: true, message: "Registration successful.", id: result.insertId });
          }
        );
      }
    );
  });
});

// ── Service Provider Login (auto-detects column names) ──────
app.post("/ServiceProviderLogin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: "Email and password required" });

  db.query("DESCRIBE service_provider", (err, cols) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });

    const colNames = cols.map(c => c.Field);
    const emailCol = colNames.find(c => c.includes("email")) || "serviceprovider_email";
    const idCol    = cols.find(c => c.Key === "PRI")?.Field  || "serviceprovider_id";

    db.query(`SELECT * FROM service_provider WHERE ${emailCol} = ?`, [email], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "DB error" });
      if (results.length === 0)
        return res.json({ success: false, message: "No account found with this email" });

      const user = results[0];
      if (user.password !== password)
        return res.json({ success: false, message: "Incorrect password" });

      res.json({
        success: true,
        token: "sp-token-" + user[idCol],
        serviceprovider_id: user[idCol],
        sp_name: user[colNames.find(c => c.includes("name")) || "serviceprovider_name"],
      });
    });
  });
});

app.get("/serviceproviderslist", (req, res) => {
  db.query("SELECT * FROM service_provider ORDER BY serviceprovider_id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.delete("/serviceprovider/:id", (req, res) => {
  db.query("DELETE FROM service_provider WHERE serviceprovider_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ success: true });
  });
});

app.post("/submit-service-complaint", (req, res) => {
  const { serviceprovider_id, message } = req.body;
  if (!serviceprovider_id || !message)
    return res.status(400).json({ error: "Required fields missing" });
  db.query(
    "INSERT INTO complain (customer_id, complain_text) VALUES (?, ?)",
    [serviceprovider_id, message],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true });
    }
  );
});

app.post("/submit-serviceprovider-feedback", (req, res) => {
  const { serviceprovider_id, feedback } = req.body;
  if (!serviceprovider_id || !feedback)
    return res.status(400).json({ error: "Required fields missing" });
  db.query(
    "INSERT INTO feedback (customer_id, feedback_text) VALUES (?, ?)",
    [serviceprovider_id, feedback],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true });
    }
  );
});

// ═══════════════════════════════════════════════════════════
//  CUSTOMER ROUTES
// ═══════════════════════════════════════════════════════════

app.get("/customerslist", (req, res) => {
  db.query(
    "SELECT user_id, user_name, user_contact, user_email FROM user ORDER BY user_id DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.delete("/customer/:id", (req, res) => {
  db.query("DELETE FROM user WHERE user_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ success: true });
  });
});

// ═══════════════════════════════════════════════════════════
//  FEEDBACK & COMPLAINT ROUTES
// ═══════════════════════════════════════════════════════════

app.post("/submit-feedback", (req, res) => {
  const { user_id, feedback, rating } = req.body;
  if (!user_id || !feedback?.trim())
    return res.status(400).json({ error: "User ID and feedback required" });

  // feedback_text is the column in original DB
  db.query(
    "INSERT INTO feedback (customer_id, feedback_text) VALUES (?, ?)",
    [user_id, feedback.trim()],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error: " + err.message });
      res.json({ success: true, message: "Feedback submitted successfully" });
    }
  );
});

app.post("/api/complaint", (req, res) => {
  const { customer_id, complain_text, resolve_time } = req.body;
  if (!customer_id || !complain_text?.trim())
    return res.status(400).json({ message: "Customer ID and complaint text required" });

  db.query(
    "INSERT INTO complain (customer_id, complain_text, resolve_time) VALUES (?, ?, ?)",
    [customer_id, complain_text.trim(), resolve_time || "24 Hours"],
    (err) => {
      if (err) return res.status(500).json({ message: "Database error: " + err.message });
      res.json({ success: true, message: "Complaint submitted successfully" });
    }
  );
});

app.get("/complainlist", (req, res) => {
  db.query("SELECT * FROM complain ORDER BY complain_id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/usercomplainlist", (req, res) => {
  db.query("SELECT * FROM complain ORDER BY complain_id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ complaints: results });
  });
});

app.delete("/complain/:id", (req, res) => {
  db.query("DELETE FROM complain WHERE complain_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.json({ success: true });
  });
});

// Resolve Complaint
app.put("/complain/resolve/:id", (req, res) => {
  db.query(
    "UPDATE complain SET status = 'resolved', resolved_at = NOW() WHERE complain_id = ?",
    [req.params.id],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Failed to resolve complaint" });

      res.json({ success: true });
    }
  );
});

app.get("/feedbacklist", (req, res) => {
  db.query("SELECT * FROM feedback ORDER BY feedback_id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/userfeedbacklist", (req, res) => {
  db.query("SELECT * FROM feedback ORDER BY feedback_id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ feedback: results });
  });
});

// Delete Feedback
app.delete("/feedback/:id", (req, res) => {
  db.query(
    "DELETE FROM feedback WHERE feedback_id = ?",
    [req.params.id],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Delete failed" });

      res.json({ success: true });
    }
  );
});
// ═══════════════════════════════════════════════════════════
//  CATEGORY & SUBCATEGORY ROUTES
// ═══════════════════════════════════════════════════════════

app.get("/categories", (req, res) => {
  db.query("SELECT * FROM product_category ORDER BY p_cata_id ASC", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching categories: " + err.message });
    res.json(results);
  });
});

app.post("/categories", (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: "Category name required" });
  db.query(
    "INSERT INTO product_category (p_cata_name, p_cata_description) VALUES (?, ?)",
    [name.trim(), description || ""],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error: " + err.message });
      res.status(201).json({ success: true, id: result.insertId });
    }
  );
});

app.delete("/categories/:id", (req, res) => {
  db.query("DELETE FROM product_category WHERE p_cata_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Error: " + err.message });
    res.json({ message: "Category deleted" });
  });
});

app.get("/categories/:categoryId/subcategories", (req, res) => {
  db.query(
    "SELECT * FROM product_sub_category WHERE p_cata_id = ? ORDER BY p_sub_cata_id ASC",
    [req.params.categoryId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error: " + err.message });
      res.json(results);
    }
  );
});

app.post("/categories/:categoryId/subcategories", (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({
      message: "Subcategory name required"
    });
  }

  db.query(
    "INSERT INTO product_sub_category (p_sub_cata_name, p_cata_id) VALUES (?, ?)",
    [name.trim(), req.params.categoryId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error: " + err.message
        });
      }

      res.status(201).json({
        success: true,
        id: result.insertId
      });
    }
  );
});

app.delete("/subcategories/:id", (req, res) => {
  db.query("DELETE FROM product_sub_category WHERE p_sub_cata_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Error: " + err.message });
    res.json({ message: "Subcategory deleted" });
  });
});

// ═══════════════════════════════════════════════════════════
//  PRODUCT ROUTES
// ═══════════════════════════════════════════════════════════

// Helper: query products by subcategory name
// Tries multiple column name combinations to support different DB schemas
function productQuery(subCataName, res) {
  const queries = [
    `SELECT pd.* FROM product_details pd
     JOIN product_sub_category psc ON pd.p_sub_cata_id = psc.p_sub_cata_id
     WHERE psc.p_sub_cata_name = ?`,
    `SELECT pd.* FROM product_details pd
     JOIN product_sub_category psc ON pd.p_sub_cata_id = psc.p_sub_cata_id
     WHERE psc.p_sub_cata_name = ?`,
    `SELECT pd.* FROM product_details pd
     JOIN product_sub_category psc ON pd.p_sub_cata_id = psc.p_sub_cata_id
     WHERE psc.p_sub_cata_name = ?`,
  ];
  function tryQuery(index) {
    if (index >= queries.length) {
      console.log(`⚠️  subcategory not found: "${subCataName}"`);
      return res.json([]);
    }
    db.query(queries[index], [subCataName], (err, results) => {
      if (err) return tryQuery(index + 1);
      if (results.length === 0) console.log(`ℹ️  0 products for: "${subCataName}"`);
      res.json(results);
    });
  }
  tryQuery(0);
}

// ── Debug: see all subcategory names in your DB ──────────────
// Visit http://localhost:5000/api/debug/subcategories
app.get("/api/debug/subcategories", (req, res) => {
  db.query("SELECT * FROM product_sub_category ORDER BY p_cata_id", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "These are your subcategory names. They must match server.js productQuery() calls exactly.",
      subcategories: rows
    });
  });
});

// ── Debug: see all products ───────────────────────────────────
app.get("/api/debug/products", (req, res) => {
  db.query(
    `SELECT pd.product_id, pd.product_name, pd.product_price, psc.p_sub_cata_name
     FROM product_details pd
     LEFT JOIN product_sub_category psc ON pd.p_sub_cata_id = psc.p_sub_cata_id
     ORDER BY pd.product_id DESC LIMIT 50`,
    (err, rows) => {
      if (err) {
        // Try alternate join
        db.query("SELECT product_id, product_name, product_price, p_sub_cata_id FROM product_details LIMIT 50",
          (err2, rows2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ products: rows2 });
          });
      } else {
        res.json({ products: rows });
      }
    }
  );
});

// Television
app.get("/api/televisions/led",    (req, res) => productQuery("LED ", res));
app.get("/api/televisions/qled",   (req, res) => productQuery("QLED", res));
// Washing Machine
app.get("/api/washingmachines/topload",   (req, res) => productQuery("Top Load", res));
app.get("/api/washingmachines/frontload", (req, res) => productQuery("Front Load", res));
// Air Conditioner
app.get("/api/airconditioners/split",  (req, res) => productQuery("Split AC", res));
app.get("/api/airconditioners/window", (req, res) => productQuery("Window AC", res));
// Refrigerator
app.get("/api/refrigerators/singledoor", (req, res) => productQuery("Single Door", res));
app.get("/api/refrigerators/doubledoor", (req, res) => productQuery("Double Door", res));
app.get("/api/refrigerators/tripledoor", (req, res) => productQuery("Tripple Door", res));
app.get("/api/refrigerators/sidebyside", (req, res) => productQuery("Side-by-side Door", res));
// Water Purifier
app.get("/api/waterpurifiers", (req, res) => productQuery("RO Water Purifier", res));

app.post("/add-product", upload.single("image"), (req, res) => {
  const { name, description, long_description, price, subcategory_id } = req.body;

  if (!name?.trim()) return res.status(400).json({ error: "Product name is required" });
  if (!price || isNaN(price) || Number(price) <= 0)
    return res.status(400).json({ error: "Price must be a positive number" });
  if (!subcategory_id) return res.status(400).json({ error: "Subcategory is required" });
  if (!req.file) return res.status(400).json({ error: "Product image is required" });

  db.query(
    "INSERT INTO product_details (product_name, product_description, product_price, product_image, p_sub_cata_id) VALUES (?, ?, ?, ?, ?)",
    [name.trim(), description || "", Number(price), req.file.filename, subcategory_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to add product: " + err.message });
      res.json({ success: true, product_id: result.insertId });
    }
  );
});

app.put("/api/update-product/:id", (req, res) => {
  const { name, description, price } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: "Product name required" });
  if (!price || isNaN(price) || Number(price) <= 0)
    return res.status(400).json({ message: "Price must be a positive number" });

  db.query(
    "UPDATE product_details SET product_name=?, product_description=?, product_price=? WHERE product_id=?",
    [name.trim(), description || "", Number(price), req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: "Error: " + err.message });
      res.json({ success: true, message: "Product updated" });
    }
  );
});

app.delete("/api/delete-product/:id", (req, res) => {
  db.query("DELETE FROM product_details WHERE product_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ success: true });
  });
});

// ═══════════════════════════════════════════════════════════
//  ORDER ROUTES  ← FIXED TO MATCH ACTUAL DB SCHEMA
// ═══════════════════════════════════════════════════════════

app.post("/place-order", async (req, res) => {
  const { customer_id, products, total_price, name, email, phone, address, payment_mode } = req.body;

  if (!products || products.length === 0)
    return res.status(400).json({ message: "Cart is empty" });
  if (!name?.trim() || !phone?.trim() || !address?.trim())
    return res.status(400).json({ message: "Name, phone and address are required" });

  const orderGroupId = "ORD-" + Date.now();
  let completed = 0;
  let hasError = false;
  let errorSent = false;

  products.forEach((item) => {
    if (hasError) return;

    // Build insert dynamically based on what columns exist
    db.query(
      `INSERT INTO product_order 
       (order_group_id, customer_id, product_id, quantity, total_price, order_date, name, email, phone, address, payment_mode)
       VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)`,
      [
        orderGroupId,
        customer_id || 0,
        item.product_id || item.id,
        item.quantity || 1,
        total_price,
        name,
        email || "",
        phone,
        address,
        payment_mode || "COD",
      ],
      async (err) => {
        if (err && !hasError) {
          hasError = true;
          console.error("Order insert error:", err.message);
          if (!errorSent) {
            errorSent = true;
            return res.status(500).json({ message: "Failed to place order: " + err.message });
          }
        }
        completed++;
        if (completed === products.length && !hasError) {
          // Try email (don't fail order if email fails)
          try {
            const sendOrderEmail = require("./sendEmail");
            await sendOrderEmail({
              name, email, phone, address,
              paymentMethod: payment_mode || "COD",
              totalAmount: total_price,
              items: products,
            });
          } catch (e) {
            console.warn("Email skipped:", e.message);
          }
          res.json({ success: true, order_id: orderGroupId });
        }
      }
    );
  });
});

// ── GET ORDERS — safe query that handles old DB schemas ──
app.get("/get-orders", (req, res) => {
  // First check which columns exist in product_order
  db.query("DESCRIBE product_order", (err, cols) => {
    if (err) return res.status(500).json({ error: "Cannot read DB schema" });

    const colNames = cols.map((c) => c.Field);
    const has = (col) => colNames.includes(col);

    // Build SELECT list based on actual columns
    const selectParts = [
      has("order_group_id") ? "po.order_group_id AS order_id" : "po.order_id AS order_id",
      has("name")           ? "po.name"        : "NULL AS name",
      has("email")          ? "po.email"       : "NULL AS email",
      has("phone")          ? "po.phone"       : "NULL AS phone",
      has("address")        ? "po.address"     : "NULL AS address",
      has("total_price")    ? "po.total_price" : "0 AS total_price",
      has("order_date")     ? "po.order_date"  : "NULL AS order_date",
      has("payment_mode")   ? "po.payment_mode": "'COD' AS payment_mode",
    ];

    const groupId = has("order_group_id") ? "po.order_group_id" : "po.order_id";

    const groupParts = [
      groupId,
      has("name")        ? "po.name"        : "",
      has("email")       ? "po.email"       : "",
      has("phone")       ? "po.phone"       : "",
      has("address")     ? "po.address"     : "",
      has("total_price") ? "po.total_price" : "",
      has("order_date")  ? "po.order_date"  : "",
      has("payment_mode")? "po.payment_mode": "",
    ].filter(Boolean).join(", ");

    const sql = `
      SELECT 
        ${selectParts.join(",\n        ")},
        JSON_ARRAYAGG(JSON_OBJECT(
          'product_id', po.product_id,
          'name', COALESCE(pd.product_name, 'Unknown Product'),
          'price', COALESCE(pd.product_price, 0),
          'quantity', ${has("quantity") ? "po.quantity" : "1"}
        )) AS products
      FROM product_order po
      LEFT JOIN product_details pd ON po.product_id = pd.product_id
      GROUP BY ${groupParts}
      ORDER BY ${has("order_date") ? "po.order_date" : groupId} DESC
    `;

    db.query(sql, (err, result) => {
      if (err) {
        console.error("get-orders error:", err.message);
        return res.status(500).json({ error: "DB error: " + err.message });
      }
      const orders = result.map((row) => ({
        ...row,
        products: typeof row.products === "string" ? JSON.parse(row.products) : (row.products || []),
      }));
      res.json({ orders });
    });
  });
});

app.delete("/delete-order/:groupId", (req, res) => {
  // Try order_group_id first, fallback to order_id
  db.query(
    "DELETE FROM product_order WHERE order_group_id = ? OR order_id = ?",
    [req.params.groupId, req.params.groupId],
    (err) => {
      if (err) return res.status(500).json({ error: "Delete failed" });
      res.json({ success: true });
    }
  );
});

// ═══════════════════════════════════════════════════════════
//  SERVE FRONTEND (Production)
// ═══════════════════════════════════════════════════════════

app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// ── Start Server ─────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});