import express from "express";
import { orderController } from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public — customer can look up their own orders by email
router.get("/by-email", orderController.getOrdersByEmail);
router.get("/:id", orderController.getOrderById);

// Public — order creation happens after payment verification
router.post("/", orderController.createOrder);

// Admin only
router.get("/", authenticateToken, orderController.getAllOrders);
router.patch("/:id/status", authenticateToken, orderController.updateOrderStatus);

export default router;
