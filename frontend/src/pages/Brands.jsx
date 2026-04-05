import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { apiService } from "../services/api";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await apiService.getProducts();
      const uniqueBrands = [
        ...new Set(
          (response.data.products || []).map((p) => p.brand).filter(Boolean)
        ),
      ].sort();
      setBrands(uniqueBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-3">
            Curated Selection
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Our Brands</h1>
          <p className="text-lg text-slate-400 max-w-md">
            Shop from top brands available in our store.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-400 text-sm">Loading brands...</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400">No brands available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand}
                to={`/shop?brand=${encodeURIComponent(brand)}`}
                className="group relative bg-white p-8 rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 text-center transform hover:-translate-y-0.5"
              >
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {brand}
                </h3>
                <div className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-slate-400 group-hover:text-rose-500 transition-colors">
                  <span>Shop</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Brands;
