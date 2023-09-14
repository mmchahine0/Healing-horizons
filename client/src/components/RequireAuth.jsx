import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";

const RequireAuth = ({ allowedRole }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has the required role
  if (allowedRole && !allowedRole.includes(auth.role)) {
    <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated and has the required role, allow access to the route
  return <Outlet />;
};

export default RequireAuth;