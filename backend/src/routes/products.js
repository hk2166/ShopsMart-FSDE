import express from "express";
import { body } from "express-validator";
import { productController } from "../controllers/productController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";

const router = express.Router();

// Validation rules
const productValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category_id").notEmpty().withMessage("Category is required"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
];

// Public routes
router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProducts);
router.get("/:id", productController.getProductById);

// Protected routes (admin only)
router.post(
  "/",
  authenticateToken,
  productValidation,
  validate,
  productController.createProduct
);
router.put("/:id", authenticateToken, productController.updateProduct);
router.delete("/:id", authenticateToken, productController.deleteProduct);

export default router;
