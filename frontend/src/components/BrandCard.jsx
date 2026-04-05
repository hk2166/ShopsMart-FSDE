import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

const BrandCard = ({ brand }) => {
    return (
        <Link
            to={`/brand/${brand.id}`}
            className="block group relative bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1 overflow-hidden"
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl flex items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-shadow border border-gray-100">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        ~{brand.avgPrepTimeMinutes + 40}m
                    </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {brand.name}
                </h3>

                <div className="flex items-start text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5 text-purple-500" />
                    <span className="line-clamp-2 leading-snug">{brand.storeLocation}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {brand.categories.slice(0, 3).map(cat => (
                        <span
                            key={cat}
                            className="text-xs bg-purple-50 text-purple-700 font-semibold px-3 py-1.5 rounded-full border border-purple-100"
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                <div className="flex items-center text-sm font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
};

export default BrandCard;
