import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const isAtuh = ( allowedRoles.includes(5150) && auth.role === 'admin' ) ||
        ( allowedRoles.includes(1984) && (auth.role === 'admin' || auth.role === 'editor') ) ||
        ( allowedRoles.includes(2001) && (auth.role === 'admin' || auth.role === 'editor' || auth.role === 'user') )
    const location = useLocation();
    return (
        isAtuh
            ? <Outlet />
            : auth?.user
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;