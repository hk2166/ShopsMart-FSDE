import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { apiService } from "../services/api";
import { useApp } from "../context/AppContext";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("q") || "";
  const { categories: cachedCategories } = useApp();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Build category name list from cached context
  const categories = useMemo(() => {
    if (!cachedCategories.length) return ["All"];
    return ["All", ...cachedCategories.map((c) => c.name)];
  }, [cachedCategories]);

  const brands = useMemo(() => {
    const uniqueBrands = [
      ...new Set(products.map((p) => p.brand).filter(Boolean)),
    ];
    return ["All", ...uniqueBrands.sort()];
  }, [products]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productsRes = await apiService.getProducts();
      setProducts(productsRes.data.products || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const categoryMatch =
        selectedCategory === "All" ||
        product.categories?.name === selectedCategory;
      const brandMatch =
        selectedBrand === "All" || product.brand === selectedBrand;
      const priceMatch =
        product.price >= priceRange.min && product.price <= priceRange.max;
      const searchMatch =
        !searchQuery ||
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && brandMatch && priceMatch && searchMatch;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        break;
    }

    return filtered;
  }, [selectedCategory, selectedBrand, products, sortBy, priceRange]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 100000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const activeFilterCount = [
    selectedCategory !== "All",
    selectedBrand !== "All",
    priceRange.min > 0 || priceRange.max < maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-black text-slate-900">Shop All</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Discover our latest collection
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
          </div>

          {/* Active Filters */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="hover:bg-slate-200 rounded-full p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedBrand !== "All" && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium">
                {selectedBrand}
                <button
                  onClick={() => setSelectedBrand("All")}
                  className="hover:bg-slate-200 rounded-full p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium cursor-pointer hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`w-full md:w-56 flex-shrink-0 ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <div className="sticky top-20 space-y-8 bg-white md:bg-transparent p-4 md:p-0 rounded-xl shadow-lg md:shadow-none border md:border-0 border-slate-100">
              {/* Mobile Filter Header */}
              <div className="flex items-center justify-between md:hidden">
                <h2 className="font-bold text-sm">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Category
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat
                          ? "bg-slate-900 text-white font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Brand
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedBrand === brand
                          ? "bg-slate-900 text-white font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="500"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: parseInt(e.target.value),
                        }))
                      }
                      className="w-full accent-slate-900"
                    />
                  </div>
                  <div>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="500"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: parseInt(e.target.value),
                        }))
                      }
                      className="w-full accent-slate-900"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>₹{priceRange.min.toLocaleString()}</span>
                    <span className="text-slate-300">-</span>
                    <span>₹{priceRange.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedBrand("All");
                    setPriceRange({ min: 0, max: maxPrice });
                  }}
                  className="w-full px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="text-center py-24">
                <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-400 mt-4 text-sm">
                  Loading products...
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-7 h-7 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No products found
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  Try adjusting your filters
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedBrand("All");
                    setPriceRange({ min: 0, max: maxPrice });
                  }}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
