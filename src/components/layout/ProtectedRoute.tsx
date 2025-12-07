import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "farmer";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if farmer is approved
  if (role === "farmer" && user && !user.is_approved) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-warning/10 flex items-center justify-center">
            <span className="text-3xl">⏳</span>
          </div>
          <h1 className="text-2xl font-heading font-bold">Account Pending Approval</h1>
          <p className="text-muted-foreground">
            Your account is awaiting admin approval. You'll be able to access the dashboard once approved.
          </p>
        </div>
      </div>
    );
  }

  if (requiredRole && role !== requiredRole) {
    const redirectPath = role === "admin" ? "/admin/dashboard" : "/farmer/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
