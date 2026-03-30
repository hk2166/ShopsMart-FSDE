import { supabase } from "../config/supabase.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/jwt.js";

export const authService = {
  // Login admin user
  async login(email, password) {
    // Get admin user by email
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single();

    if (error || !admin) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Return user info (without password) and token
    return {
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  },

  // Get current user info
  async getCurrentUser(userId) {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, email, name, role, created_at")
      .eq("id", userId)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      throw new Error("User not found");
    }

    return data;
  },

  // Create new admin user (for initial setup)
  async createAdmin(adminData) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminData.password, salt);

    const { data, error } = await supabase
      .from("admin_users")
      .insert([
        {
          email: adminData.email,
          password_hash: passwordHash,
          name: adminData.name,
          role: adminData.role || "admin",
        },
      ])
      .select("id, email, name, role")
      .single();

    if (error) throw error;

    return data;
  },
};
