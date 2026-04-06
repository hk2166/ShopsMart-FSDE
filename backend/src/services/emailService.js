import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || "VeloStyle <orders@velostyle.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@velostyle.com";

const formatCurrency = (amount) =>
  `₹${parseFloat(amount).toLocaleString("en-IN")}`;

const orderItemsHtml = (items = []) =>
  items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">
        ${item.product_image ? `<img src="${item.product_image}" width="48" height="48" style="border-radius:6px;object-fit:cover;vertical-align:middle;margin-right:10px;" />` : ""}
        <span style="font-size:14px;color:#1e293b;">${item.product_title}${item.size ? ` (${item.size})` : ""}</span>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;text-align:center;font-size:14px;color:#64748b;">×${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;text-align:right;font-size:14px;font-weight:600;color:#1e293b;">${formatCurrency(item.total_price)}</td>
    </tr>`
    )
    .join("");

export const emailService = {
  async sendOrderConfirmation(order) {
    if (!process.env.RESEND_API_KEY) return; // Skip if not configured

    const html = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;">
        <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin-bottom:4px;">Order Confirmed!</h1>
        <p style="color:#64748b;font-size:14px;margin-bottom:24px;">Hi ${order.customer_name}, your order has been placed successfully.</p>

        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:24px;">
          <p style="margin:0;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Order ID</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#0f172a;font-family:monospace;">${order.id.slice(0, 8).toUpperCase()}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr>
              <th style="text-align:left;font-size:11px;color:#94a3b8;text-transform:uppercase;padding-bottom:8px;">Item</th>
              <th style="text-align:center;font-size:11px;color:#94a3b8;text-transform:uppercase;padding-bottom:8px;">Qty</th>
              <th style="text-align:right;font-size:11px;color:#94a3b8;text-transform:uppercase;padding-bottom:8px;">Price</th>
            </tr>
          </thead>
          <tbody>${orderItemsHtml(order.order_items)}</tbody>
        </table>

        <div style="border-top:2px solid #f1f5f9;padding-top:16px;margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span style="font-size:14px;color:#64748b;">Subtotal</span>
            <span style="font-size:14px;color:#1e293b;">${formatCurrency(order.subtotal)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span style="font-size:14px;color:#64748b;">Delivery</span>
            <span style="font-size:14px;color:#1e293b;">${formatCurrency(order.delivery_fee)}</span>
          </div>
          ${parseFloat(order.discount) > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-size:14px;color:#16a34a;">Discount</span><span style="font-size:14px;color:#16a34a;">−${formatCurrency(order.discount)}</span></div>` : ""}
          <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid #f1f5f9;">
            <span style="font-size:16px;font-weight:700;color:#0f172a;">Total</span>
            <span style="font-size:16px;font-weight:700;color:#0f172a;">${formatCurrency(order.total)}</span>
          </div>
        </div>

        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:24px;">
          <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;">Delivery Address</p>
          <p style="margin:0;font-size:14px;color:#1e293b;">${order.address}, ${order.city}, ${order.state} — ${order.pincode}</p>
          <p style="margin:4px 0 0;font-size:14px;color:#64748b;">${order.customer_phone}</p>
        </div>

        <p style="font-size:12px;color:#94a3b8;text-align:center;">Thank you for shopping with VeloStyle 🇮🇳</p>
      </div>`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customer_email,
      subject: `Order Confirmed — #${order.id.slice(0, 8).toUpperCase()}`,
      html,
    });
  },

  async sendAdminNewOrderAlert(order) {
    if (!process.env.RESEND_API_KEY) return;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Order #${order.id.slice(0, 8).toUpperCase()} — ${formatCurrency(order.total)}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
          <h2 style="color:#0f172a;">New Order Received</h2>
          <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_email})</p>
          <p><strong>Phone:</strong> ${order.customer_phone}</p>
          <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
          <p><strong>Payment:</strong> ${order.payment_method} — ${order.payment_status}</p>
          <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state} ${order.pincode}</p>
          <p><strong>Items:</strong> ${(order.order_items || []).length}</p>
        </div>`,
    });
  },
};
