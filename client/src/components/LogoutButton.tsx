import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = "", 
  variant = "outline",
  size = "default"
}) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
};
