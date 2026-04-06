import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import VariantsEditor from "../components/VariantsEditor";
import { apiService } from "../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [variants, setVariants] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    compare_price: "",
    stock: "",
    category_id: "",
    brand: "",
    images: [],
    is_active: true,
  });

  useEffect(() => {
    Promise.all([fetchProduct(), fetchCategories()]).finally(() =>
      setFetching(false)
    );
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await apiService.getProductById(id);
      const p = res.data;
      setFormData({
        title: p.title || "",
        description: p.description || "",
        price: p.price || "",
        compare_price: p.compare_price || "",
        stock: p.stock || "",
        category_id: p.category_id || "",
        brand: p.brand || "",
        images: p.images || [],
        is_active: p.is_active ?? true,
      });
      setVariants(
        (p.product_variants || []).map((v) => ({
          size: v.size || "",
          color: v.color || "",
          sku: v.sku || "",
          stock: v.stock ?? "",
          price_modifier: v.price_modifier ?? "0",
        }))
      );
    } catch {
      setError("Failed to load product");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiService.getCategories();
      setCategories(res.data);
    } catch {
      console.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const urls = [];
      for (const file of files) {
        const res = await apiService.uploadImage(file);
        urls.push(res.data.url);
      }
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch {
      setError("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { setError("Title is required"); return; }
    if (!formData.price || parseFloat(formData.price) <= 0) { setError("Price must be greater than 0"); return; }
    if (formData.stock === "" || parseInt(formData.stock) < 0) { setError("Stock must be 0 or more"); return; }

    setLoading(true);
    setError("");
    try {
      await apiService.updateProduct(id, {
        ...formData,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        stock: parseInt(formData.stock),
        variants: variants
          .filter((v) => v.size || v.color || v.sku)
          .map((v) => ({
            ...v,
            stock: parseInt(v.stock) || 0,
            price_modifier: parseFloat(v.price_modifier) || 0,
          })),
      });
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h2>

              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Title *</label>
                  <input type="text" name="title" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={formData.title} onChange={handleChange} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea name="description" rows="4" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={formData.description} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₹) *</label>
                    <input type="number" name="price" step="0.01" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={formData.price} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Compare at Price (₹)</label>
                    <input type="number" name="compare_price" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={formData.compare_price} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
                    <input type="number" name="stock" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={formData.stock} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <select name="category_id" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={formData.category_id} onChange={handleChange}>
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <input type="text" name="brand" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={formData.brand} onChange={handleChange} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative">
                          <img src={url} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded" loading="lazy" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                </div>

                {/* Variants */}
                <VariantsEditor variants={variants} onChange={setVariants} />

                <div className="flex items-center">
                  <input type="checkbox" name="is_active" id="is_active" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Product is active (visible on website)</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button type="button" onClick={() => navigate("/admin/products")} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading || uploading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
