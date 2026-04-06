import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
    <p className="text-8xl font-black text-slate-100 select-none">404</p>
    <h1 className="text-2xl font-bold text-slate-900 mt-2 mb-2">Page not found</h1>
    <p className="text-slate-500 text-sm mb-8 max-w-xs">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Home
    </Link>
  </div>
);

export default NotFound;
