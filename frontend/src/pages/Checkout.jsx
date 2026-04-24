import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Lock, Truck, CreditCard, Tag } from "lucide-react";
import { apiService } from "../services/api";
import { DELIVERY_FEE } from "../constants";

const validate = (formData) => {
  const errors = {};
  if (!formData.name.trim()) errors.name = "Name is required";
  if (!formData.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    errors.email = "Enter a valid email";
  if (!formData.phone.trim()) errors.phone = "Phone is required";
  else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, "")))
    errors.phone = "Enter a valid 10-digit Indian mobile number";
  if (!formData.address.trim()) errors.address = "Address is required";
  if (!formData.city.trim()) errors.city = "City is required";
  if (!formData.state.trim()) errors.state = "State is required";
  if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
  else if (!/^\d{6}$/.test(formData.pincode))
    errors.pincode = "Enter a valid 6-digit pincode";
  return errors;
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "razorpay",
  });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const total = cartTotal + DELIVERY_FEE - discount;

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await apiService.validateCoupon(couponCode, cartTotal);
      setDiscount(res.data.discount_amount);
      setCouponApplied(true);
      setCouponError("");
    } catch {
      setCouponError("Invalid or expired coupon code");
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const buildOrderData = (paymentId = null, paymentStatus = "pending") => ({
    customer_name: formData.name,
    customer_email: formData.email,
    customer_phone: formData.phone,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    subtotal: cartTotal,
    delivery_fee: DELIVERY_FEE,
    discount,
    total,
    payment_id: paymentId,
    payment_status: paymentStatus,
    payment_method: formData.paymentMethod,
    coupon_code: couponApplied ? couponCode : null,
    items: cart.map((item) => ({
      product_id: item.id,
      product_title: item.title || item.name,
      product_image: item.images?.[0] || null,
      size: item.size || null,
      quantity: item.quantity,
      unit_price: item.price,
    })),
  });

  const handleCOD = async () => {
    setLoading(true);
    try {
      const res = await apiService.createOrder(buildOrderData());
      clearCart();
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load payment gateway. Check your internet connection.");
        setLoading(false);
        return;
      }

      const { data } = await apiService.createPaymentOrder(total);

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "VeloStyle",
        description: "Order Payment",
        order_id: data.razorpay_order_id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#000000" },
        handler: async (response) => {
          try {
            const verifyRes = await apiService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: buildOrderData(response.razorpay_payment_id, "paid"),
            });
            clearCart();
            navigate(`/order-confirmation/${verifyRes.data.id}`);
          } catch {
            alert("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Could not initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (formData.paymentMethod === "cod") {
      await handleCOD();
    } else {
      await handleRazorpay();
    }
  };

  const inputClasses =
    "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 outline-none transition-all placeholder:text-slate-300";

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Delivery Details */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="w-5 h-5 text-slate-400" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Delivery Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={inputClasses} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className={inputClasses} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" className={inputClasses} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Pincode *</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="400001" className={inputClasses} maxLength={6} />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Address *</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="House no, Building, Street, Area..." className={inputClasses} />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" className={inputClasses} />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">State *</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Maharashtra" className={inputClasses} />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Payment Method
                  </h2>
                </div>
                <div className="space-y-2">
                  {[
                    { value: "razorpay", label: "Pay Online (UPI / Card / Netbanking)", icon: <CreditCard className="w-4 h-4 text-blue-500" /> },
                    { value: "cod", label: "Cash on Delivery", icon: <Truck className="w-4 h-4 text-green-500" /> },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${
                        formData.paymentMethod === method.value
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleChange}
                        className="accent-slate-900"
                      />
                      {method.icon}
                      <span className="text-sm font-medium text-slate-800">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading
                  ? "Processing..."
                  : formData.paymentMethod === "cod"
                  ? "Place Order"
                  : "Pay Now"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-20 border border-slate-100 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Order Summary
              </h3>

              <div className="space-y-3 max-h-52 overflow-y-auto text-sm">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between">
                    <span className="text-slate-500 truncate mr-3">
                      {item.quantity}× {item.title || item.name}
                      {item.size ? ` (${item.size})` : ""}
                    </span>
                    <span className="font-medium text-slate-900 whitespace-nowrap">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  <Tag className="w-3 h-3 inline mr-1" />
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); setCouponApplied(false); setDiscount(0); }}
                    placeholder="SAVE10"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                    disabled={couponApplied}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    className="px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 disabled:bg-green-600 transition-colors"
                  >
                    {couponApplied ? "✓" : "Apply"}
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                {couponApplied && <p className="text-green-600 text-xs mt-1">Coupon applied! You save ₹{discount}</p>}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Fee</span>
                  <span className="font-medium">₹{DELIVERY_FEE}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
