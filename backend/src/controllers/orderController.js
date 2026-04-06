import { orderService } from "../services/orderService.js";
import { emailService } from "../services/emailService.js";

export const orderController = {
  async createOrder(req, res, next) {
    try {
      const order = await orderService.createOrder(req.body);
      // Send emails non-blocking
      emailService.sendOrderConfirmation(order).catch(() => {});
      emailService.sendAdminNewOrderAlert(order).catch(() => {});
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },

  async getAllOrders(req, res, next) {
    try {
      const { page, limit, status } = req.query;
      const result = await orderService.getAllOrders({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getOrderById(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  },

  async getOrdersByEmail(req, res, next) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const orders = await orderService.getOrdersByEmail(email);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },

  async updateOrderStatus(req, res, next) {
    try {
      const { status } = req.body;
      const validStatuses = [
        "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      const order = await orderService.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error) {
      next(error);
    }
  },

  async getAdminStats(req, res, next) {
    try {
      const stats = await orderService.getAdminStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },
};
