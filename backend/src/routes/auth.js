import express from "express";
import { authController } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", authController.login);
router.post("/register", authController.register); // For initial setup only

// Protected routes
router.get("/me", authenticateToken, authController.getCurrentUser);

export default router;
