import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";

interface Props {
  role?: "admin" | "driver";
  children: React.ReactNode;
}

export const PublicRoute = ({ role, children }: Props) => {
  // Safely get auth context - handle case where provider might not be available
  const authContext = useContext(AuthContext);
  
  // If AuthProvider is not available, just render children (public route)
  if (!authContext) {
    return <>{children}</>;
  }

  const { user, isLoading, isAuthenticated } = authContext as AuthContextType;

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

  // Redirect to dashboard if already authenticated and role matches
  if (isAuthenticated && user && user.role) {
    if (!role || user.role === role) {
      return <Navigate to={`/${user.role}/dashboard`} replace />;
    }
  }

  return <>{children}</>;
};
