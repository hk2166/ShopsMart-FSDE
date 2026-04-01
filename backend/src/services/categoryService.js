import { supabase } from "../config/supabase.js";

export const categoryService = {
  // Get all categories
  async getAllCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return data;
  },

  // Get single category
  async getCategoryById(id) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Category not found");

    return data;
  },

  // Create category
  async createCategory(categoryData) {
    const { data, error } = await supabase
      .from("categories")
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // Update category
  async updateCategory(id, updates) {
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Category not found");

    return data;
  },
};
