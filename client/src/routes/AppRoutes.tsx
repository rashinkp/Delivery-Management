import type { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";

// Driver pages
import DriverLogin from "@/pages/driver/Login";
import DriverDashboard from "@/pages/driver/Dashboard";
import AdminLayout from "@/components/layouts/AdminLayout";
import DriverManagement from "@/pages/admin/DriverManagement";
import VendorManagement from "@/pages/admin/VendorManagement";
import OrderManagement from "@/pages/admin/OrderManagement";
import DriverLayout from "@/components/layouts/DriverLayout";
import Order from "@/pages/driver/Order";

const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Navigate to="/admin/dashboard" />
          </AdminLayout>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="truck-drivers" element={<DriverManagement />} />
        <Route path="vendors" element={<VendorManagement />} />
        <Route path="orders" element={<OrderManagement />} />
      </Route>

      {/* Driver routes */}
      <Route path="/driver/login" element={<DriverLogin />} />
      <Route
        path="/driver"
        element={
          <DriverLayout>
            <Navigate to="/driver/dashboard" />
          </DriverLayout>
        }
      >
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="deliveries" element={<Order />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
