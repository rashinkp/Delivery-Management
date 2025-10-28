import type { FC } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const DriverLayout: FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/driver/dashboard" className="font-bold text-xl text-gray-900">
              Wholesale Delivery
            </Link>
            <nav className="hidden md:flex items-center gap-5 ml-6">
              <NavLink
                to="/driver/dashboard"
                className={({ isActive }) =>
                  `text-sm ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-gray-900"}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/driver/deliveries"
                className={({ isActive }) =>
                  `text-sm ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-gray-900"}`
                }
              >
                Create Order
              </NavLink>
              <NavLink
                to="/driver/orders"
                className={({ isActive }) =>
                  `text-sm ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-gray-900"}`
                }
              >
                My Orders
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-sm font-medium text-gray-900">{user.name || "Driver"}</span>
                <span className="text-xs text-gray-500">{user.mobile}</span>
              </div>
            )}
            <Button variant="outline" onClick={logout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content container */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DriverLayout;
