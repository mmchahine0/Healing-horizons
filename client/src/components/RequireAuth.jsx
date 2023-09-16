import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from 'axios';
import useAuth from "../context/useAuth";

const RequireAuth = ({ allowedRole }) => {
  const { auth } = useAuth();
  const location = useLocation();


  if (auth.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
  }

  if (!auth.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if (allowedRole && !allowedRole.includes(auth.role)) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // } //notfound

  return <Outlet />;
};

export default RequireAuth;
