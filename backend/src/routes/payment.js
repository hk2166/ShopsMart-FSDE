import express from "express";
import { paymentService } from "../services/paymentService.js";
import { orderService } from "../services/orderService.js";
import { emailService } from "../services/emailService.js";

const router = express.Router();

// Create a Razorpay order (called before showing payment modal)
router.post("/create-order", async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }
    const razorpayOrder = await paymentService.createRazorpayOrder(amount);
    res.json({
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
});

// Verify payment and save order
router.post("/verify", async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    const isValid = paymentService.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Save order with payment details
    const order = await orderService.createOrder({
      ...orderData,
      payment_id: razorpay_payment_id,
      payment_status: "paid",
      payment_method: "razorpay",
    });

    // Send emails (non-blocking)
    emailService.sendOrderConfirmation(order).catch(() => {});
    emailService.sendAdminNewOrderAlert(order).catch(() => {});

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

export default router;
