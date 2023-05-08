import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AuthRequired = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return !auth?.accessToken ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default AuthRequired;
