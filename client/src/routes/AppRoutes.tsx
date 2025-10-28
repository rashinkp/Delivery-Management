import type { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import DriverManagement from "@/pages/admin/DriverManagement";
import VendorManagement from "@/pages/admin/VendorManagement";
import ProductManagement from "@/pages/admin/ProductManagement";
import OrderManagement from "@/pages/admin/OrderManagement";

import DriverLogin from "@/pages/driver/DriverLogin";
import DriverDashboard from "@/pages/driver/Dashboard";
import Order from "@/pages/driver/Order";
import DriverOrders from "@/pages/driver/Orders";

import AdminLayout from "@/components/layouts/AdminLayout";
import DriverLayout from "@/components/layouts/DriverLayout";
import { PublicRoute } from "@/components/PublicRoutes";
import { ProtectedRoute } from "@/components/ProtectedRoutes";
import NotFound from "@/pages/NotFound";

const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin/login"
        element={
          <PublicRoute role="admin">
            <AdminLogin />
          </PublicRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="truck-drivers" element={<DriverManagement />} />
        <Route path="vendors" element={<VendorManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
      </Route>

      {/* ================= DRIVER ROUTES ================= */}
      <Route
        path="/driver/login"
        element={
          <PublicRoute role="driver">
            <DriverLogin />
          </PublicRoute>
        }
      />

      <Route
        path="/driver"
        element={
          <ProtectedRoute role="driver">
            <DriverLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="deliveries" element={<Order />} />
        <Route path="orders" element={<DriverOrders />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
