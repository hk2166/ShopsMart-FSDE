import express from "express";
import { couponController } from "../controllers/couponController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public route - validate coupon
router.post("/validate", couponController.validateCoupon);

// Admin routes - require authentication
router.get("/", authenticateToken, couponController.getAllCoupons);
router.get("/:id", authenticateToken, couponController.getCouponById);
router.post("/", authenticateToken, couponController.createCoupon);
router.put("/:id", authenticateToken, couponController.updateCoupon);
router.delete("/:id", authenticateToken, couponController.deleteCoupon);

export default router;
