import React from "react";
import { Link } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";

const ProductCard = ({ product }) => {
  const discount =
    product.compare_price > product.price
      ? Math.round(
          ((product.compare_price - product.price) / product.compare_price) *
            100
        )
      : 0;

  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : `https://placehold.co/400x600/f0f0f0/999999?text=${encodeURIComponent(
          product.title || "No Image"
        )}`;

  // Use Supabase image transform for thumbnails if it's a Supabase storage URL
  const thumbnailUrl = productImage.includes("supabase.co/storage")
    ? `${productImage}?width=400&quality=75`
    : productImage;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-3/4 overflow-hidden bg-slate-100 rounded-2xl mb-3 shadow-sm group-hover:shadow-lg transition-all duration-500">
        <img
          src={thumbnailUrl}
          alt={product.title}
          loading="lazy"
          width={400}
          height={533}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-slate-900/90 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full">
              Sold Out
            </span>
          </div>
        )}
        {product.stock > 0 && product.stock < 5 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-amber-500 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full">
              Only {product.stock} left
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full">
              -{discount}%
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute bottom-3 right-3 z-10">
          <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
            <Heart className="w-4 h-4 text-slate-500 hover:text-rose-500 hover:fill-rose-500 transition-all" />
          </button>
        </div>
      </div>

      <div className="px-1">
        {product.brand && (
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
            {product.brand}
          </p>
        )}
        <h3 className="text-sm font-medium text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2 mb-2 leading-snug">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-xs text-slate-400 line-through">
              ₹{product.compare_price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
