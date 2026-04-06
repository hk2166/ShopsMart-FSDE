import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();
  const deliveryFee = 79;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Your bag is empty
        </h2>
        <p className="text-slate-500 text-sm mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/shop"
          className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">
          Shopping Bag
          <span className="text-slate-400 font-normal text-lg ml-2">
            ({cart.length})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 divide-y divide-slate-100">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-5 py-6 first:pt-0"
              >
                <div className="w-24 h-28 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm truncate">
                        {item.name}
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Size: {item.size}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900 text-sm whitespace-nowrap">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-slate-500" />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold border-x border-slate-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-2xl p-6 sticky top-20">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">
                Order Summary
              </h3>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Fee</span>
                  <span className="font-medium text-slate-900">
                    ₹{deliveryFee}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹{(cartTotal + deliveryFee).toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-medium mb-5 text-center">
                Order now for delivery in ~60 minutes
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-slate-900 text-white py-3.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
