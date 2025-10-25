import { useAuth } from "@/contexts/AuthContext";
import { LogoutButton } from "./LogoutButton";

export const UserInfo: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full" />
        <div className="animate-pulse bg-gray-200 h-4 w-24 rounded" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          {user.name || user.email || user.mobile}
        </p>
        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
      </div>
      <LogoutButton size="sm" />
    </div>
  );
};
