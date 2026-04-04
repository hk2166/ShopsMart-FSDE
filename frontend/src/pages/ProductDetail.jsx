import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { apiService } from "../services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { location } = useUser();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await apiService.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        <p className="text-slate-400 mt-4 text-sm">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">
          Product not found
        </h2>
        <Link
          to="/shop"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (
      !selectedSize &&
      product.sizeOptions &&
      product.sizeOptions.length > 0
    ) {
      alert("Please select a size");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (
      !selectedSize &&
      product.sizeOptions &&
      product.sizeOptions.length > 0
    ) {
      alert("Please select a size");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    navigate("/cart");
  };

  const handleNextImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const discount =
    product.compare_price > product.price
      ? Math.round(
          ((product.compare_price - product.price) / product.compare_price) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/shop"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden group">
              <img
                src={productImages[selectedImage]}
                alt={product.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {productImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-white transition-all">
                <Heart className="w-5 h-5 text-slate-400 hover:text-rose-500 hover:fill-rose-500 transition-colors" />
              </button>

              {product.stock === 0 && (
                <div className="absolute top-4 left-4">
                  <span className="bg-slate-900/90 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
              {product.stock > 0 && product.stock < 5 && (
                <div className="absolute top-4 left-4">
                  <span className="bg-amber-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    Only {product.stock} left
                  </span>
                </div>
              )}

              {/* Image indicator dots */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImage === idx
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-slate-900"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            <div className="mb-6">
              {product.brand && (
                <p className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center mt-3 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-2 text-xs text-slate-500">
                  4.8/5 (127 reviews)
                </span>
              </div>

              <div className="flex items-baseline mt-5 gap-3">
                <span className="text-3xl font-black text-slate-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.compare_price &&
                  product.compare_price > product.price && (
                    <>
                      <span className="text-lg text-slate-400 line-through">
                        ₹{product.compare_price.toLocaleString()}
                      </span>
                      <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {discount}% OFF
                      </span>
                    </>
                  )}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="border-y border-slate-100 py-5 space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Deliver to{" "}
                    <span className="font-bold">
                      {location ? location.area : "Select location"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-emerald-700">
                  Est. delivery in{" "}
                  {product.estimatedDeliveryMinutes || 60} minutes
                </p>
              </div>
            </div>

            {/* Size Selection — from real product_variants */}
            {product.product_variants && product.product_variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Select Size / Variant
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.product_variants.map((variant) => {
                    const label = [variant.size, variant.color].filter(Boolean).join(" / ") || variant.sku || "Default";
                    const outOfStock = variant.stock === 0;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => !outOfStock && setSelectedSize(label)}
                        disabled={outOfStock}
                        className={`min-w-12 h-11 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                          selectedSize === label
                            ? "bg-slate-900 text-white shadow-md"
                            : outOfStock
                            ? "bg-slate-50 text-slate-300 cursor-not-allowed line-through"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-slate-900"
                        }`}
                      >
                        {label}
                        {variant.price_modifier > 0 && (
                          <span className="ml-1 text-xs opacity-70">+₹{variant.price_modifier}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fallback: legacy sizeOptions */}
            {(!product.product_variants || product.product_variants.length === 0) &&
              product.sizeOptions && product.sizeOptions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 h-11 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "bg-slate-900 text-white shadow-md"
                          : "bg-white border border-slate-200 text-slate-700 hover:border-slate-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-slate-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold border-x border-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-slate-700 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  addedToCart
                    ? "bg-emerald-600 text-white"
                    : product.stock === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]"
                }`}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Added to Cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full py-3.5 rounded-full font-semibold text-sm border border-slate-900 text-slate-900 hover:bg-slate-50 transition-colors disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                Buy Now
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Truck, label: "Fast Delivery" },
                { icon: ShieldCheck, label: "100% Authentic" },
                { icon: RotateCcw, label: "Easy Returns" },
                { icon: Package, label: "Secure Packaging" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl"
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-slate-600">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16 max-w-3xl pb-12">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Product Description
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            {product.description ||
              "No description available for this product."}
          </p>

          <div className="mt-8 bg-slate-50 rounded-xl p-6">
            <h3 className="font-bold text-sm text-slate-900 mb-4">
              Product Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {product.brand && (
                <div className="flex">
                  <span className="font-medium text-slate-500 w-28">Brand</span>
                  <span className="text-slate-900">{product.brand}</span>
                </div>
              )}
              {product.categories && (
                <div className="flex">
                  <span className="font-medium text-slate-500 w-28">
                    Category
                  </span>
                  <span className="text-slate-900">
                    {product.categories.name}
                  </span>
                </div>
              )}
              <div className="flex">
                <span className="font-medium text-slate-500 w-28">
                  Availability
                </span>
                <span
                  className={
                    product.stock > 0
                      ? "text-emerald-600 font-medium"
                      : "text-red-500 font-medium"
                  }
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </span>
              </div>
              {product.sizeOptions && product.sizeOptions.length > 0 && (
                <div className="flex">
                  <span className="font-medium text-slate-500 w-28">Sizes</span>
                  <span className="text-slate-900">
                    {product.sizeOptions.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
