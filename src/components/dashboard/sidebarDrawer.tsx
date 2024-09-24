/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { LogOut, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { logout } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import showToast from "../common/toast";
import { useSelector } from "react-redux";
import { AccessRole } from "@/types/types";
import { otherslinks, patientEditorLinks, viewerLinks } from "./sidebar";

const SidebarDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { pathname } = useLocation();
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  console.log(isLoading, "Loading");

  const handleLogOut = async () => {
    try {
      setIsLoading(true);

      await signOut(auth);

      dispatch(logout());
      showToast(toast, "SCA", "warning", "You've successfully signed out");
    } catch (error) {
      console.log(error);
      showToast(
        toast,
        "SCA",
        "error",
        "An error occured while trying log you out"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const links =
    user?.accessRole === AccessRole.Admin ||
    user?.accessRole === AccessRole.Editor
      ? otherslinks
      : user?.accessRole === AccessRole.PatientEditor
      ? patientEditorLinks
      : viewerLinks;

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />

      <DrawerContent
        backgroundColor={"black"}
        color={"white"}
        maxWidth="184px"
        width="80%"
      >
        <DrawerBody>
          <div className="   flex   overflow-y-scroll remove-scrollbar shadow-md text-white items-center bg-black justify-between flex-col h-full space-y-12  px-2   pt-8 pb-10 ">
            <div onClick={() => onClose()} className="mb-5 cursor-pointer">
              <X size={30} />
            </div>
            <div className="space-y-9 flex-1">
              {links.map((link, i) => (
                <Link
                  key={i}
                  className={`flex rounded py-4 px-6 ${
                    pathname === link.link
                      ? "bg-gradient-to-r from-[#242a2b] via-[#1d2225] to-[#171b1e]"
                      : "hover:bg-gradient-to-r from-[#242a2b] via-[#1d2225] to-[#171b1e]"
                  }     flex-col gap-2 items-center `}
                  to={link.link}
                >
                  {link.icon}
                  <p className="text-xs">{link.title}</p>
                </Link>
              ))}
            </div>

            <button
              onClick={() => handleLogOut()}
              className="flex rounded py-4 px-6 hover:bg-gradient-to-r from-[#242a2b] via-[#1d2225] to-[#171b1e]    flex-col gap-2 items-center"
            >
              <LogOut color="red" />
              <p className="text-xs text-[#fb0000]">Log Out</p>
            </button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SidebarDrawer;
