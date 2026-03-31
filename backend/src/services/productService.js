import { supabase } from "../config/supabase.js";

export const productService = {
  // Get all products with category info
  async getAllProducts(filters = {}) {
    let query = supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        )
      `
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters.category) {
      query = query.eq("category_id", filters.category);
    }

    if (filters.minPrice) {
      query = query.gte("price", filters.minPrice);
    }

    if (filters.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }

    if (filters.brand) {
      query = query.eq("brand", filters.brand);
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const offset = (page - 1) * limit;

    // Get total count
    const { count: totalCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;

    return {
      products: data,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
      },
    };
  },

  // Get single product by ID
  async getProductById(id) {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        product_variants (*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Product not found");

    return data;
  },

  // Create new product
  async createProduct(productData) {
    const { variants, ...product } = productData;

    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

    if (error) throw error;

    if (variants && variants.length > 0) {
      const variantRows = variants.map((v) => ({ ...v, product_id: data.id }));
      const { error: varErr } = await supabase.from("product_variants").insert(variantRows);
      if (varErr) throw varErr;
    }

    return data;
  },

  // Update product
  async updateProduct(id, updates) {
    const { variants, ...product } = updates;

    const { data, error } = await supabase
      .from("products")
      .update(product)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Product not found");

    if (variants !== undefined) {
      // Delete existing variants and re-insert
      await supabase.from("product_variants").delete().eq("product_id", id);
      if (variants.length > 0) {
        const variantRows = variants.map((v) => ({ ...v, product_id: id }));
        const { error: varErr } = await supabase.from("product_variants").insert(variantRows);
        if (varErr) throw varErr;
      }
    }

    return data;
  },

  // Delete product (soft delete)
  async deleteProduct(id) {
    const { data, error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Product not found");

    return data;
  },

  // Hard delete product
  async hardDeleteProduct(id) {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;

    return { message: "Product permanently deleted" };
  },

  // Search products
  async searchProducts(searchTerm) {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        )
      `
      )
      .or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`
      )
      .eq("is_active", true)
      .limit(20);

    if (error) throw error;

    return data;
  },
};
