// AdminLayout.tsx
import type{ FC } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout: FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet /> {/* 🧩 Nested routes render here */}
      </main>
    </div>
  );
};

export default AdminLayout;
