import express from "express";
import multer from "multer";
import { uploadController } from "../controllers/uploadController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for memory storage (we'll upload to Supabase)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"), false);
      return;
    }
    cb(null, true);
  },
});

// Protected routes (admin only)
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  uploadController.uploadImage
);
router.post(
  "/multiple",
  authenticateToken,
  upload.array("images", 10),
  uploadController.uploadMultipleImages
);

export default router;
