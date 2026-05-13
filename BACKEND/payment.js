require("dotenv").config();
const express = require("express");
const router = express.Router();

const KEY_ID     = process.env.RAZORPAY_KEY_ID     || "rzp_test_SgPSwKkrO0I17f";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET  || "ivFlVXmIGKCzm8K3cDXhjDN4";

let razorpay = null;
try {
  const Razorpay = require("razorpay");
  razorpay = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
  console.log("✅ Razorpay initialized");
} catch (e) {
  console.warn("⚠️  Razorpay not available:", e.message);
}

router.post("/create-order", async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ error: "Payment gateway not configured. Use COD instead." });
  }
  const { amount } = req.body;
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: "Valid amount is required" });
  }
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // convert to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
    res.json(order);
  } catch (err) {
    console.error("Razorpay error:", err.message);
    res.status(500).json({ error: "Payment gateway error: " + err.message });
  }
});

module.exports = router;
