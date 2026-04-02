import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, Zap, Menu, X, Search } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { apiService } from "../services/api";

const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const Navbar = () => {
  const { cartCount } = useCart();
  const { location: userLocation, detectedCity } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const [scrolled, setScrolled] = useState(!isHomePage);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => setScrolled(window.scrollY > 100);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const fetchResults = async () => {
      setSearchLoading(true);
      try {
        const res = await apiService.searchProducts(debouncedQuery);
        setSearchResults(res.data?.slice(0, 6) || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-700 ${
          scrolled
            ? "bg-white/90 border-slate-200/60 shadow-sm translate-y-0 opacity-100"
            : "bg-transparent border-transparent shadow-none -translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Left Side - Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/brands" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors relative group">
                Brands
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-slate-900 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/shop" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors relative group">
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-slate-900 group-hover:w-full transition-all duration-300" />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Centered Logo */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
              <span className="text-xl font-black tracking-[0.15em] text-slate-900 uppercase">Velostyle</span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.querySelector("input")?.focus(), 50); }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-slate-700" />
                </button>

                {searchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 p-3 border-b border-slate-100">
                      <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        autoFocus
                      />
                      {searchQuery && (
                        <button type="button" onClick={() => { setSearchQuery(""); setSearchResults([]); }} className="text-slate-400 hover:text-slate-600">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </form>

                    {searchLoading && (
                      <div className="p-4 text-center">
                        <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto" />
                      </div>
                    )}

                    {!searchLoading && searchResults.length > 0 && (
                      <ul className="py-2 max-h-72 overflow-y-auto">
                        {searchResults.map((product) => (
                          <li key={product.id}>
                            <Link
                              to={`/product/${product.id}`}
                              onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                            >
                              {product.images?.[0] && (
                                <img src={product.images[0]} alt={product.title} className="w-10 h-10 object-cover rounded-lg bg-slate-100" loading="lazy" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{product.title}</p>
                                <p className="text-xs text-slate-500">₹{product.price?.toLocaleString()}</p>
                              </div>
                            </Link>
                          </li>
                        ))}
                        <li className="px-4 py-2 border-t border-slate-100">
                          <button onClick={handleSearchSubmit} className="text-xs text-slate-500 hover:text-slate-900 font-medium">
                            See all results for "{searchQuery}" →
                          </button>
                        </li>
                      </ul>
                    )}

                    {!searchLoading && searchQuery.length >= 2 && searchResults.length === 0 && (
                      <p className="p-4 text-sm text-slate-400 text-center">No products found</p>
                    )}
                  </div>
                )}
              </div>

              {/* Location Indicator */}
              {userLocation ? (
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-medium text-slate-700 truncate max-w-[100px]">{userLocation.area}</span>
                </div>
              ) : detectedCity ? (
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">{detectedCity.city}</span>
                </div>
              ) : (
                <Link to="/" className="hidden sm:flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors">
                  <Zap className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-medium text-slate-700">Check Delivery</span>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ShoppingBag className="w-5 h-5 text-slate-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold leading-none text-white bg-slate-900 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-80 border-t border-slate-100" : "max-h-0"}`}>
          <div className="px-4 py-4 space-y-1 bg-white/95 backdrop-blur-xl">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-lg mb-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
              />
            </form>
            <Link to="/brands" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">Brands</Link>
            <Link to="/shop" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">Shop</Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
