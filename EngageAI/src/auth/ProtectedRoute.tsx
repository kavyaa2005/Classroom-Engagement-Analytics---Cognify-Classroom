import { Navigate } from "react-router";
import { useAuth, UserRole } from "./AuthContext";

interface ProtectedRouteProps {
    role: UserRole;
    children: React.ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== role) {
        // Redirect to their actual dashboard
        return <Navigate to={`/${user?.role}`} replace />;
    }

    return <>{children}</>;
}
