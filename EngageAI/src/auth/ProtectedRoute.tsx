import { Navigate, Outlet } from "react-router";
import type { UserRole } from "./AuthContext";

const STORAGE_KEY = "engageai_user";
const VALID_ROLES: UserRole[] = ["admin", "teacher", "student"];

/** Read the stored user directly from localStorage — always sync, no race. */
function getStoredUser(): { role: UserRole } | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed?.role && VALID_ROLES.includes(parsed.role)) return parsed;
        return null;
    } catch {
        return null;
    }
}

interface ProtectedRouteProps {
    role: UserRole;
    /** Optional children — used for standalone pages that skip layout wrapping. */
    children?: React.ReactNode;
}

/**
 * Guards a route subtree by role.
 * – When used as a layout route (no children):  renders <Outlet /> on auth success.
 * – When used with children (standalone page):  renders {children} on auth success.
 * Reads localStorage directly so there is ZERO timing race with React state.
 */
export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
    const user = getStoredUser();

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;

    return children ? <>{children}</> : <Outlet />;
}
