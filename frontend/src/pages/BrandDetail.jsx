import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, ArrowLeft } from 'lucide-react';
import { BRANDS, PRODUCTS } from '../data/mockData';
import ProductCard from '../components/ProductCard';

const BrandDetail = () => {
    const { id } = useParams();
    const brand = BRANDS.find(b => b.id === id);
    const brandProducts = PRODUCTS.filter(p => p.brandId === id);

    if (!brand) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Brand not found</h2>
                <Link to="/brands" className="text-black underline">Back to Brands</Link>
            </div>
        );
    }

    return (
        <div>
            {/* Brand Header */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link to="/brands" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Brands
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white rounded-full p-4 shadow-sm flex items-center justify-center">
                                <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{brand.name}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" /> {brand.storeLocation}
                                    </span>
                                    <span className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" /> ~{brand.avgPrepTimeMinutes + 40} min delivery
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold mb-8">Available Products</h2>
                {brandProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {brandProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No products available from this brand at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default BrandDetail;
