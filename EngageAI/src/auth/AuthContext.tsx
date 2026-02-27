import { createContext, useContext, useState, ReactNode } from "react";
import { setToken, removeToken } from "../services/api";

export type UserRole = "admin" | "teacher" | "student";

export interface AuthUser {
    _id?: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    login: (role: UserRole, name: string, email: string, token?: string, id?: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "engageai_user";
const TOKEN_KEY = "engageai_token";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [token, setTokenState] = useState<string | null>(() =>
        localStorage.getItem(TOKEN_KEY)
    );

    const login = (role: UserRole, name: string, email: string, jwtToken?: string, id?: string) => {
        const newUser: AuthUser = { name, email, role, ...(id ? { _id: id } : {}) };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        setUser(newUser);
        if (jwtToken) {
            setToken(jwtToken);
            setTokenState(jwtToken);
        }
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        removeToken();
        setUser(null);
        setTokenState(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
