import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  role?: "admin" | "driver";
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ role, children }: Props) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    const loginPath = role === "admin" ? "/admin/login" : "/driver/login";
    return <Navigate to={loginPath} replace />;
  }

  // Redirect to correct dashboard if user role doesn't match required role
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
