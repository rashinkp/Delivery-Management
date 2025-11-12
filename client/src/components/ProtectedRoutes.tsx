import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  role?: "admin" | "driver";
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ role, children }: Props) => {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

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

  // Check if driver is blocked/inactive
  if (user.role === "driver" && user.status === "inactive") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Account Blocked
            </h1>
            <p className="text-gray-600 mb-6">
              Your account has been blocked. Please contact the administrator for assistance.
            </p>
            <Button
              onClick={logout}
              className="w-full"
              variant="outline"
            >
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to correct dashboard if user role doesn't match required role
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
