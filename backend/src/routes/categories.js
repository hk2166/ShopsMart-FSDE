import express from "express";
import { categoryController } from "../controllers/categoryController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Protected routes (admin only)
router.post("/", authenticateToken, categoryController.createCategory);
router.put("/:id", authenticateToken, categoryController.updateCategory);

export default router;
