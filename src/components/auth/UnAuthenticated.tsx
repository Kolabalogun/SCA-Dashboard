/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactNode } from "react";

const UnAuthenticated = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  return !isAuthenticated ? children : <Navigate to={"/dashboard"} replace />;
};

export default UnAuthenticated;
