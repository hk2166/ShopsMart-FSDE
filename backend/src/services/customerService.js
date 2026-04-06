import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase.js";
import { generateToken } from "../config/jwt.js";

export const customerService = {
  async register({ name, email, password, phone }) {
    // Check if email already exists
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) throw new Error("Email already registered");

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("customers")
      .insert([{ name, email, password_hash, phone }])
      .select("id, name, email, phone, created_at")
      .single();

    if (error) throw error;

    const token = generateToken({ id: data.id, email: data.email, role: "customer" });
    return { customer: data, token };
  },

  async login({ email, password }) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single();

    if (error || !data) throw new Error("Invalid email or password");

    const valid = await bcrypt.compare(password, data.password_hash);
    if (!valid) throw new Error("Invalid email or password");

    const { password_hash, ...customer } = data;
    const token = generateToken({ id: customer.id, email: customer.email, role: "customer" });
    return { customer, token };
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, name, email, phone, created_at")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },
};
