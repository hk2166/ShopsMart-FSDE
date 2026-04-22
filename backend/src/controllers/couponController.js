import { couponService } from "../services/couponService.js";

export const couponController = {
  // POST /api/coupons/validate - Validate coupon code (public)
  async validateCoupon(req, res, next) {
    try {
      const { code, order_amount } = req.body;

      if (!code || !order_amount) {
        return res.status(400).json({
          error: "Coupon code and order amount are required",
        });
      }

      const result = await couponService.validateCoupon(code, order_amount);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // GET /api/coupons - Get all coupons (admin)
  async getAllCoupons(req, res, next) {
    try {
      const coupons = await couponService.getAllCoupons();
      res.json({ success: true, data: coupons });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/coupons/:id - Get coupon by ID (admin)
  async getCouponById(req, res, next) {
    try {
      const coupon = await couponService.getCouponById(req.params.id);
      res.json({ success: true, data: coupon });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/coupons - Create coupon (admin)
  async createCoupon(req, res, next) {
    try {
      const coupon = await couponService.createCoupon(req.body);
      res.status(201).json({ success: true, data: coupon });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/coupons/:id - Update coupon (admin)
  async updateCoupon(req, res, next) {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      res.json({ success: true, data: coupon });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/coupons/:id - Delete coupon (admin)
  async deleteCoupon(req, res, next) {
    try {
      const result = await couponService.deleteCoupon(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};
