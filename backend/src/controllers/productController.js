import { productService } from "../services/productService.js";

export const productController = {
  // GET /api/products
  async getAllProducts(req, res, next) {
    try {
      const filters = {
        category: req.query.category,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        brand: req.query.brand,
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await productService.getAllProducts(filters);
      res.set('Cache-Control', 'public, max-age=60');
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/products/:id
  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/products
  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/products/:id
  async updateProduct(req, res, next) {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body
      );
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/products/:id
  async deleteProduct(req, res, next) {
    try {
      const result = await productService.deleteProduct(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/products/search
  async searchProducts(req, res, next) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ error: "Search query required" });
      }

      const products = await productService.searchProducts(q);
      res.json(products);
    } catch (error) {
      next(error);
    }
  },
};
