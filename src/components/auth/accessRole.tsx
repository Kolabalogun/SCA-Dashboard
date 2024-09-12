/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export enum AccessRoleEnum {
  No_Access = "No Access",
  Viewer = "Viewer",
  Editor = "Editor",
  PatientEditor = "PatientEditor",
  Admin = "Admin",
}

const AccessRole = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: AccessRoleEnum[];
}) => {
  const { user } = useSelector((state: any) => state.auth);

  // Get the current location
  const location = useLocation()?.pathname;

  // Check if user role is allowed
  if (allowedRoles.includes(user?.accessRole)) {
    return children;
  } else {
    return <Navigate to={"/dashboard"} state={{ from: location }} replace />;
  }
};

export default AccessRole;
