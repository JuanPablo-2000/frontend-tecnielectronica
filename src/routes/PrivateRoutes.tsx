import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoutes = ({ children, redirectTo, isAllowed }: any) => {
  return !isAllowed ? (
    <Navigate to={redirectTo} />
  ) : children ? (
    children
  ) : (
    <Outlet />
  );
};
