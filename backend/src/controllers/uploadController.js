import { uploadService } from "../services/uploadService.js";

export const uploadController = {
  // POST /api/upload
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const result = await uploadService.uploadImage(req.file);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/upload/multiple
  async uploadMultipleImages(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const results = await uploadService.uploadMultipleImages(req.files);
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
};
