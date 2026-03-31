import { supabase } from "../config/supabase.js";

export const uploadService = {
  // Upload image to Supabase Storage
  async uploadImage(file) {
    // Sanitize filename: remove special characters and spaces
    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/_+/g, "_");
    const fileName = `${Date.now()}-${sanitizedName}`;
    const filePath = `products/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("products")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(filePath);

    return {
      path: data.path,
      url: publicUrl,
    };
  },

  // Upload multiple images
  async uploadMultipleImages(files) {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results;
  },

  // Delete image from storage
  async deleteImage(filePath) {
    const { error } = await supabase.storage
      .from("products")
      .remove([filePath]);

    if (error) throw error;

    return { message: "Image deleted successfully" };
  },
};
