import { supabase } from "../config/supabase.js";

export const couponService = {
  // Validate coupon code
  async validateCoupon(code, orderAmount) {
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      throw new Error("Invalid coupon code");
    }

    // Check if expired
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      throw new Error("Coupon has expired");
    }

    // Check minimum order amount
    if (orderAmount < coupon.min_order) {
      throw new Error(
        `Minimum order amount of ₹${coupon.min_order} required for this coupon`
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === "flat") {
      discountAmount = coupon.discount_value;
    } else if (coupon.discount_type === "percent") {
      discountAmount = (orderAmount * coupon.discount_value) / 100;
    }

    return {
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount: Math.round(discountAmount * 100) / 100, // Round to 2 decimals
    };
  },

  // Get all coupons (admin)
  async getAllCoupons() {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get coupon by ID (admin)
  async getCouponById(id) {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create coupon (admin)
  async createCoupon(couponData) {
    const { data, error } = await supabase
      .from("coupons")
      .insert([
        {
          code: couponData.code.toUpperCase(),
          discount_type: couponData.discount_type,
          discount_value: couponData.discount_value,
          min_order: couponData.min_order || 0,
          expiry_date: couponData.expiry_date || null,
          is_active: couponData.is_active !== false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update coupon (admin)
  async updateCoupon(id, couponData) {
    const updateData = {};
    if (couponData.code) updateData.code = couponData.code.toUpperCase();
    if (couponData.discount_type) updateData.discount_type = couponData.discount_type;
    if (couponData.discount_value !== undefined)
      updateData.discount_value = couponData.discount_value;
    if (couponData.min_order !== undefined) updateData.min_order = couponData.min_order;
    if (couponData.expiry_date !== undefined)
      updateData.expiry_date = couponData.expiry_date;
    if (couponData.is_active !== undefined) updateData.is_active = couponData.is_active;

    const { data, error } = await supabase
      .from("coupons")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete coupon (admin)
  async deleteCoupon(id) {
    const { error } = await supabase.from("coupons").delete().eq("id", id);

    if (error) throw error;
    return { message: "Coupon deleted successfully" };
  },
};
