import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  redirectPath?: string;
}

const ProtectedRoute = ({
  requireAdmin = false,
  redirectPath = "/",
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  // Return loading state if user is not yet determined
  // This prevents flashing of redirect before auth state is fully loaded
  if (user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If admin route is required, check if user is both authenticated and admin
  if (requireAdmin) {
    return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to={redirectPath} replace />;
  }

  // For regular protected routes
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute; 