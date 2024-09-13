/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/config/firebase";
import { logout } from "@/redux/features/authSlice";
import { useToast } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import showToast from "../common/toast";

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
  const location = useLocation()?.pathname;
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    // If the user has "No Access" role, log them out
    if (user?.accessRole === AccessRoleEnum.No_Access) {
      handleLogOut();
    }
  }, [user?.accessRole]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      showToast(
        toast,
        "SCA",
        "warning",
        "You've been logged out due to insufficient access rights"
      );
    } catch (error) {
      console.error(error);
      showToast(
        toast,
        "SCA",
        "error",
        "An error occurred while trying to log you out"
      );
    }
  };

  // Check if the user's role is allowed for this route
  if (allowedRoles.includes(user?.accessRole)) {
    return children;
  } else {
    // Redirect the user if their role is not allowed
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }
};

export default AccessRole;
