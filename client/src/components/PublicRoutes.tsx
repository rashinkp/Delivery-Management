import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  role?: "admin" | "driver";
  children: React.ReactNode;
}

export const PublicRoute = ({ role, children }: Props) => {
  const user = useAuthStore((s) => s.user);
  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};
