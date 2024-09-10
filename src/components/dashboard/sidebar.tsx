/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToast } from "@chakra-ui/react";
import {
  ChartCandlestick,
  Contact,
  HomeIcon,
  Landmark,
  LogOut,
  Menu,
  Settings,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ConfirmationModal from "../common/ConfirmationModal";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { logout } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import showToast from "../common/Toast";

const Sidebar = () => {
  const toast = useToast();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const links = [
    {
      icon: <HomeIcon size={20} />,
      title: "Home",
      link: "/dashboard",
    },
    {
      icon: <Users size={20} />,
      title: "Patients",
      link: "/dashboard/patients",
    },
    // {
    //   icon: <Users size={20} />,
    //   title: "Doctors",
    //   link: "/dashboard/profile",
    // },
    {
      icon: <Contact size={20} />,
      title: "Staffs",
      link: "/dashboard/staffs",
    },
    {
      icon: <Landmark size={20} />,
      title: "Revenue",
      link: "/dashboard/revenue",
    },
    {
      icon: <ChartCandlestick size={20} />,
      title: "Expenses",
      link: "/dashboard/expenses",
    },
    {
      icon: <Settings size={20} />,
      title: "Settings",
      link: "/dashboard/settings",
    },
  ];

  return (
    <>
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isOpen}
        onConfirm={handleLogOut}
        onCancel={() => setIsOpen(false)}
        isLoading={isLoading}
        title="Confirm "
        message="Are you sure you want to Log Out?"
      />

      <div className="w-32 border-r overflow-y-scroll remove-scrollbar shadow-md text-white flex justify-between flex-col h-full space-y-12  px-2 items-center pt-8 pb-10 ">
        <div className="mb-10 cursor-pointer">
          <Menu size={24} />
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
          onClick={() => setIsOpen(true)}
          className="flex rounded py-4 px-6 hover:bg-gradient-to-r from-[#242a2b] via-[#1d2225] to-[#171b1e]    flex-col gap-2 items-center"
        >
          <LogOut color="red" />
          <p className="text-xs text-[#fb0000]">Log Out</p>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
