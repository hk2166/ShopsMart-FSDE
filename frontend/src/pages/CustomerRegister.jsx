import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";

const CustomerRegister = () => {
  const { register } = useCustomer();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid 10-digit mobile number";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 outline-none transition-all";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-black tracking-widest text-slate-900 uppercase">Velostyle</Link>
          <h1 className="text-xl font-bold text-slate-900 mt-4">Create an account</h1>
          <p className="text-slate-500 text-sm mt-1">Join us to track your orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {serverError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={inputClasses} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={inputClasses} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" className={inputClasses} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone (optional)</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" className={inputClasses} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-400 mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-slate-900 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
