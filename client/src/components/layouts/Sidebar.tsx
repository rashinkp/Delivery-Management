import type { FC } from "react";
import { NavLink } from "react-router-dom";

const Sidebar: FC = () => {
  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Truck Drivers", path: "/admin/truck-drivers" },
    { label: "Vendors", path: "/admin/vendors" },
    { label: "Orders", path: "/admin/orders" },
  ];

  return (
    <aside className="w-64 bg-white shadow p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded hover:bg-gray-100 ${
                isActive ? "bg-gray-200 font-bold" : ""
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
