import express from "express";
import { orderController } from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

router.get("/stats", orderController.getAdminStats);

export default router;
