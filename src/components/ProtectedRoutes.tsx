import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "./ui/skeleton";

export const ProtectedRoutes = () => {
    const { user, loading } = useAuth();  
    if (loading) {
        return (
            <Skeleton className="h-screen flex justify-center mx-auto items-center bg-transparent">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-lg text-muted-foreground">Loading...</p>
                </div>
            </Skeleton>
        );
    }
    
    return user ? <Outlet /> : <Navigate to="/signin" />;
} 