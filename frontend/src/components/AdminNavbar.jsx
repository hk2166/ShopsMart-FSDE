import { Link, useNavigate, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("admin_user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="text-xl font-bold">
              VeloStyle Admin
            </Link>
            <div className="ml-10 flex space-x-4">
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/admin/dashboard")
                    ? "bg-indigo-700"
                    : "hover:bg-indigo-500"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/products"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/admin/products")
                    ? "bg-indigo-700"
                    : "hover:bg-indigo-500"
                }`}
              >
                Products
              </Link>
              <Link
                to="/admin/products/new"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/admin/products/new")
                    ? "bg-indigo-700"
                    : "hover:bg-indigo-500"
                }`}
              >
                Add Product
              </Link>
              <Link
                to="/admin/coupons"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/admin/coupons")
                    ? "bg-indigo-700"
                    : "hover:bg-indigo-500"
                }`}
              >
                Coupons
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
