import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Truck, MapPin, ArrowRight } from "lucide-react";
import { apiService } from "../services/api";

const STATUS_STEPS = ["confirmed", "processing", "shipped", "delivered"];

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await apiService.getOrderById(orderId);
        setOrder(res.data);
      } catch {
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-slate-500">{error || "Order not found."}</p>
        <Link to="/" className="text-sm font-semibold text-slate-900 underline">
          Go to Homepage
        </Link>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-slate-500 text-sm mb-4">
            Thank you, {order.customer_name}. We've received your order.
          </p>
          <div className="inline-block bg-slate-100 rounded-lg px-4 py-2">
            <span className="text-xs text-slate-500 font-medium">Order ID</span>
            <p className="text-sm font-bold text-slate-900 font-mono">
              {order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
            Order Status
          </h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 z-0" />
            {STATUS_STEPS.map((step, idx) => (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    idx <= currentStep
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {idx < currentStep ? "✓" : idx + 1}
                </div>
                <span className="text-xs text-slate-500 capitalize hidden sm:block">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Items Ordered
            </h2>
          </div>
          <div className="space-y-3">
            {(order.order_items || []).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0"
              >
                {item.product_image && (
                  <img
                    src={item.product_image}
                    alt={item.product_title}
                    className="w-14 h-14 object-cover rounded-lg bg-slate-100"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {item.product_title}
                  </p>
                  {item.size && (
                    <p className="text-xs text-slate-400">Size: {item.size}</p>
                  )}
                  <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                  ₹{parseFloat(item.total_price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>₹{parseFloat(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery Fee</span>
              <span>₹{parseFloat(order.delivery_fee).toLocaleString()}</span>
            </div>
            {parseFloat(order.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−₹{parseFloat(order.discount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-100">
              <span>Total Paid</span>
              <span>₹{parseFloat(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Delivery Address
            </h2>
          </div>
          <p className="text-sm text-slate-700 font-medium">{order.customer_name}</p>
          <p className="text-sm text-slate-500">{order.address}</p>
          <p className="text-sm text-slate-500">
            {order.city}, {order.state} — {order.pincode}
          </p>
          <p className="text-sm text-slate-500 mt-1">{order.customer_phone}</p>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Payment
            </h2>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Method</span>
            <span className="font-medium capitalize">{order.payment_method}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-slate-500">Status</span>
            <span
              className={`font-semibold capitalize ${
                order.payment_status === "paid" ? "text-green-600" : "text-amber-600"
              }`}
            >
              {order.payment_status}
            </span>
          </div>
          {order.payment_id && (
            <div className="flex justify-between text-sm mt-2">
              <span className="text-slate-500">Payment ID</span>
              <span className="font-mono text-xs text-slate-700">{order.payment_id}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/shop"
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 py-3 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
