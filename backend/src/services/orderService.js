import { supabase } from "../config/supabase.js";

export const orderService = {
  async createOrder(orderData) {
    const { items, ...order } = orderData;

    // Insert order
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert([order])
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id || null,
      product_title: item.product_title,
      product_image: item.product_image || null,
      size: item.size || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return newOrder;
  },

  async getAllOrders({ page = 1, limit = 20, status } = {}) {
    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return { orders: data, total: count, page, limit };
  },

  async getOrderById(id) {
    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items(*)`)
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Order not found");

    return data;
  },

  async getOrdersByEmail(email) {
    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items(*)`)
      .eq("customer_email", email)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(id, status) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Order not found");

    return data;
  },

  async updatePaymentStatus(id, { payment_status, payment_id }) {
    const { data, error } = await supabase
      .from("orders")
      .update({ payment_status, payment_id })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Order not found");

    return data;
  },

  async getAdminStats() {
    // Get date 7 days ago for orders per day chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const [productsRes, ordersRes, revenueRes, todayRes, lowStockRes, recentOrdersRes] =
      await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total").eq("payment_status", "paid"),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .gte("created_at", new Date().toISOString().split("T")[0]),
        supabase
          .from("products")
          .select("id, title, stock")
          .lt("stock", 5)
          .eq("is_active", true),
        supabase
          .from("orders")
          .select("created_at")
          .gte("created_at", sevenDaysAgoStr)
          .order("created_at", { ascending: true }),
      ]);

    const totalRevenue = (revenueRes.data || []).reduce(
      (sum, o) => sum + parseFloat(o.total),
      0
    );

    // Group orders by day for the chart
    const ordersPerDay = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split("T")[0];
      ordersPerDay[dateStr] = 0;
    }

    (recentOrdersRes.data || []).forEach((order) => {
      const dateStr = order.created_at.split("T")[0];
      if (ordersPerDay[dateStr] !== undefined) {
        ordersPerDay[dateStr]++;
      }
    });

    const ordersPerDayArray = Object.entries(ordersPerDay).map(([date, count]) => ({
      date,
      orders: count,
    }));

    return {
      totalProducts: productsRes.count || 0,
      totalOrders: ordersRes.count || 0,
      totalRevenue,
      ordersToday: todayRes.count || 0,
      lowStockProducts: lowStockRes.data || [],
      ordersPerDay: ordersPerDayArray,
    };
  },
};
