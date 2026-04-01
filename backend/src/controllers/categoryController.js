import { categoryService } from "../services/categoryService.js";

export const categoryController = {
  // GET /api/categories
  async getAllCategories(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories();
      res.set('Cache-Control', 'public, max-age=60');
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/categories/:id
  async getCategoryById(req, res, next) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/categories
  async createCategory(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/categories/:id
  async updateCategory(req, res, next) {
    try {
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.json(category);
    } catch (error) {
      next(error);
    }
  },
};
