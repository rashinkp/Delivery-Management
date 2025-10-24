// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  role?: "admin" | "driver";
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ role, children }: Props) => {
  const user = useAuthStore((s) => s.user);

  // If no user logged in, go to respective login page
  if (!user) {
    return <Navigate to={`/${role}/login`} replace />;
  }

  // If user role doesn’t match, deny access
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
