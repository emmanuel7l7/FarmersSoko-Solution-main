import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "farmer" | "customer";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - Current user:', user);
  console.log('ProtectedRoute - Required role:', requiredRole);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log('ProtectedRoute - Role mismatch, redirecting to home');
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 