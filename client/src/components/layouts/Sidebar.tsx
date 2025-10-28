import type { FC } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { useAdminLogout } from "@/hooks/useAdminLogout";

const Sidebar: FC = () => {
    const { mutate: logout, isPending } = useAdminLogout();

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Truck Drivers", path: "/admin/truck-drivers" },
    { label: "Vendors", path: "/admin/vendors" },
    { label: "Products", path: "/admin/products" },
    { label: "Orders", path: "/admin/orders" },
  ];

   const handleLogout = () => {
     logout();
   };

  return (
    <aside className="w-64 bg-white shadow p-4 flex flex-col justify-between h-screen">
      <div>
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded hover:bg-gray-100 transition ${
                  isActive ? "bg-gray-200 font-bold" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 🔘 Logout Button */}
      <Button
        onClick={handleLogout}
        className="mt-6 w-full px-4 py-2 text-center bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </Button>
    </aside>
  );
};

export default Sidebar;
