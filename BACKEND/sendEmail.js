require("dotenv").config();
const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

module.exports = async function sendOrderEmail({ name, email, phone, address, paymentMethod, totalAmount, items }) {
  // Skip silently if email not configured
  if (!EMAIL_USER || !EMAIL_PASS || EMAIL_USER === "your_email@gmail.com") {
    console.log("📧 Email not configured — skipping order email");
    return;
  }
  if (!email) {
    console.log("📧 No customer email — skipping order email");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });

    const itemRows = (items || []).map(
      (item) => `<tr>
        <td style="padding:8px;border:1px solid #eee">${item.name || item.product_name}</td>
        <td style="padding:8px;border:1px solid #eee;text-align:center">${item.quantity || 1}</td>
        <td style="padding:8px;border:1px solid #eee;text-align:right">₹${Number(item.price || 0).toLocaleString("en-IN")}</td>
      </tr>`
    ).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#e8400a;padding:20px;text-align:center">
          <h1 style="color:#fff;margin:0">Order Confirmed! 🎉</h1>
        </div>
        <div style="padding:24px">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for your order! Here are your order details:</p>
          
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <thead>
              <tr style="background:#f7f7f7">
                <th style="padding:10px;border:1px solid #eee;text-align:left">Product</th>
                <th style="padding:10px;border:1px solid #eee">Qty</th>
                <th style="padding:10px;border:1px solid #eee;text-align:right">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:10px;border:1px solid #eee;font-weight:bold">Total</td>
                <td style="padding:10px;border:1px solid #eee;text-align:right;font-weight:bold;color:#e8400a">
                  ₹${Number(totalAmount || 0).toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>

          <div style="background:#f7f7f7;padding:16px;border-radius:8px;margin-top:16px">
            <h3 style="margin:0 0 10px">Delivery Details</h3>
            <p style="margin:4px 0">📍 ${address}</p>
            <p style="margin:4px 0">📞 ${phone}</p>
            <p style="margin:4px 0">💳 Payment: ${paymentMethod || "COD"}</p>
          </div>

          <p style="margin-top:20px">We'll notify you when your order is shipped.</p>
          <p>Thank you for shopping with <strong>Balaji Enterprises</strong>!</p>
        </div>
        <div style="background:#f7f7f7;padding:14px;text-align:center;color:#9ca3af;font-size:12px">
          © ${new Date().getFullYear()} Balaji Enterprises. All rights reserved.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Balaji Enterprises" <${EMAIL_USER}>`,
      to: email,
      subject: "✅ Order Confirmed — Balaji Enterprises",
      html,
    });
    console.log("📧 Order confirmation email sent to:", email);
  } catch (err) {
    console.warn("📧 Email failed (order still placed):", err.message);
  }
};
