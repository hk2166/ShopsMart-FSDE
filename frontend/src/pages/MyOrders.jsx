import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";
import { useCustomer } from "../context/CustomerContext";
import { apiService } from "../services/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const MyOrders = () => {
  const { customer, loading: authLoading } = useCustomer();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !customer) {
      navigate("/login", { state: { from: "/my-orders" } });
      return;
    }
    if (customer) {
      apiService
        .getOrdersByEmail(customer.email)
        .then((res) => setOrders(res.data || []))
        .catch(() => setError("Failed to load orders"))
        .finally(() => setLoading(false));
    }
  }, [customer, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-6 h-6 text-slate-700" />
          <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-900 mb-2">No orders yet</h2>
            <p className="text-slate-500 text-sm mb-6">Start shopping to see your orders here</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Order ID</p>
                    <p className="text-sm font-bold text-slate-900 font-mono">
                      {order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || "bg-slate-100 text-slate-600"}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items preview */}
                <div className="space-y-2 mb-4">
                  {(order.order_items || []).slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.product_image && (
                        <img src={item.product_image} alt={item.product_title} className="w-10 h-10 object-cover rounded-lg bg-slate-100" loading="lazy" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate">{item.product_title}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}{item.size ? ` · ${item.size}` : ""}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-900">₹{parseFloat(item.total_price).toLocaleString()}</p>
                    </div>
                  ))}
                  {(order.order_items || []).length > 3 && (
                    <p className="text-xs text-slate-400">+{order.order_items.length - 3} more items</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p className="text-sm font-bold text-slate-900">₹{parseFloat(order.total).toLocaleString()}</p>
                  </div>
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
