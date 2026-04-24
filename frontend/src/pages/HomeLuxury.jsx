import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { apiService } from "../services/api";
import { useApp } from "../context/AppContext";
import { SPLASH_TIMEOUT, PRODUCTS_LIMIT_HOME } from "../constants";

const HomeLuxury = () => {
  const { categories, categoriesLoading } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetchData();
    
    // Handle scroll to hide splash
    const handleScroll = () => {
      if (window.scrollY > 50 && showSplash) {
        setShowSplash(false);
      }
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Auto-hide splash after timeout if user doesn't scroll
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_TIMEOUT);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [showSplash]);

  const fetchData = async () => {
    try {
      const productsRes = await apiService.getProducts({ limit: PRODUCTS_LIMIT_HOME });
      setProducts(productsRes.data.products || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Full Screen Splash - VeloStyle Logo */}
      <div
        className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-all duration-1000 ${
          showSplash ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ 
          backdropFilter: showSplash ? 'none' : 'blur(10px)',
        }}
      >
        <div className="text-center px-4">
          {/* Animated Logo */}
          <div className="overflow-hidden mb-6">
            <h1 
              className={`text-7xl md:text-9xl lg:text-[11rem] font-light tracking-tight text-black transition-all duration-1000 ${
                showSplash ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
              }`}
              style={{ 
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '-0.02em'
              }}
            >
              VeloStyle
            </h1>
          </div>
          
          {/* Decorative Line */}
          <div className="relative h-[1px] w-48 mx-auto mb-6 overflow-hidden">
            <div 
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A961] to-transparent transition-all duration-1000 delay-300 ${
                showSplash ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
              }`}
            ></div>
          </div>

          {/* Tagline */}
          <p 
            className={`text-xs md:text-sm tracking-[0.4em] uppercase text-gray-500 mb-8 transition-all duration-1000 delay-500 ${
              showSplash ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Handcrafted in India
          </p>

          {/* Scroll Hint */}
          <div 
            className={`transition-all duration-1000 delay-700 ${
              showSplash ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="animate-bounce">
              <p className="text-xs text-gray-400 mb-3 font-light">Scroll to explore</p>
              <div className="w-[1px] h-16 bg-gradient-to-b from-gray-400 via-gray-300 to-transparent mx-auto"></div>
            </div>
          </div>

          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
        </div>
      </div>

      {/* Hero Section - Full Screen with Minimal Text */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1920&q=80"
            alt="Luxury Handcrafted"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#C9A961]" />
            <span className="text-xs tracking-[0.2em] uppercase font-medium">
              Handcrafted in India
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight mb-8 text-black leading-[0.95]">
            VeloStyle
            
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Discover authentic Indian craftsmanship. Each piece tells a story of tradition, sustainability, and artisan excellence.
          </p>

          <Link
            to="/shop"
            className="btn-luxury inline-flex items-center gap-3 px-10 py-4 bg-black text-white hover:bg-[#C9A961] transition-all duration-300"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-black/20 to-transparent"></div>
        </div>
      </section>

      {/* Featured Categories - Minimal Grid */}
      <section className="py-32 px-4 md:px-8 lg:px-16 max-w-[1800px] mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
            Collections
          </p>
          <h2 className="text-5xl md:text-6xl font-light text-black">
            Curated for You
          </h2>
        </div>

        {loading || categoriesLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border border-black/20 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category, idx) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.slug}`}
                className="group luxury-image-hover"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative aspect-[3/4] mb-6 bg-gray-100">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-light text-black group-hover:text-[#C9A961] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 font-light">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-black group-hover:text-[#C9A961] transition-colors pt-2">
                    Discover
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Full Width Image Banner */}
      <section className="relative h-[70vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1920&q=80"
          alt="Artisan Craftsmanship"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 opacity-90">
              Handcrafted Excellence
            </p>
            <h2 className="text-5xl md:text-7xl font-light mb-6">
              Made with Love
            </h2>
            <p className="text-lg font-light max-w-2xl mx-auto opacity-90">
              Supporting 10,000+ artisans across India. Every purchase preserves traditional crafts and empowers communities.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products - Minimal Layout */}
      <section className="py-32 px-4 md:px-8 lg:px-16 max-w-[1800px] mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
              New Arrivals
            </p>
            <h2 className="text-5xl md:text-6xl font-light text-black">
              Latest Collection
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-sm tracking-wider uppercase hover:text-[#C9A961] transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border border-black/20 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.slice(0, 8).map((product, idx) => (
                <div
                  key={product.id}
                  className="opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link
                to="/shop"
                className="btn-luxury inline-flex items-center gap-3 px-10 py-4 border border-black text-black hover:bg-black hover:text-white transition-all duration-300"
              >
                View Full Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Values Section - Minimal Icons */}
      <section className="py-32 bg-[#f8f8f8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-[#C9A961]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-light">100% Organic</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Certified organic materials, free from chemicals and pesticides
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-[#C9A961]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light">Artisan Crafted</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Handmade by skilled artisans preserving centuries-old traditions
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-[#C9A961]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light">Fair Trade</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Ethical practices ensuring fair wages and community support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Minimal */}
      <section className="py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-6">
            Stay Connected
          </p>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Join Our Community
          </h2>
          <p className="text-gray-600 mb-12 font-light">
            Be the first to discover new collections and exclusive offers
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors text-sm"
            />
            <button
              type="submit"
              className="btn-luxury px-8 py-4 bg-black text-white hover:bg-[#C9A961] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Make in India Badge - Minimal */}
      <section className="py-20 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-[2px]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl">🇮🇳</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-light mb-4">Proudly Made in India</h3>
          <p className="text-sm text-gray-600 font-light max-w-2xl mx-auto">
            Every purchase supports local artisans and preserves India's rich cultural heritage. 
            Together, we're building a sustainable future for traditional crafts.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomeLuxury;
